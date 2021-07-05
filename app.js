const logger = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const axios = require('axios');
const convert = require('xml-js');
const { Pool } = require('pg');

const { manejoErroresPeticion, registroError } = require('justine/lib/utilidades');
let { configuracion } = require('./configuracion.js');

let session = require('express-session');
let redisStore = require('connect-redis')(session);
let sessionConfig = configuracion.session;
sessionConfig.store = new redisStore(configuracion['redisAcceso']);

let sambaApi = axios.create(
    configuracion['sambaApi'].acceso
);

let sambaDominio = configuracion['sambaApi'].dominio;

let configZimbraApi = configuracion['zimbraApi'];
configZimbraApi.transformRequest = [function (data, headers) {
    let datos = convert.js2xml(data, {compact: true, spaces: 4});
    return datos;
}];

configZimbraApi.transformResponse = [function (data) {
    let contenido = convert.xml2js(data, {compact: true, spaces: 4});
    return contenido['soap:Envelope']['soap:Body'];
}]

// TODO: Esto no deberá ir en producción
const https = require('https');
configZimbraApi.httpsAgent = new https.Agent({
	rejectUnauthorized: false
});

let zimbraApi = axios.create(
    configZimbraApi    
);

let psqlAcceso = new Pool(configuracion['psqlAcceso']);

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/usuarios');
let loginRouter = require('./routes/login');

let app = express();

/* Dispongo de los accesos a API y Base de Datos */
app.set('zimbraApi', zimbraApi);
app.set('sambaApi', sambaApi);
app.set('sambaDominio', sambaDominio);
app.set('psqlAcceso', psqlAcceso);
app.set('zimbraCreds', configuracion.credenciales.zimbra);

app.use(session(sessionConfig));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://127.0.0.1:4000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', indexRouter);
app.use('/usuarios', usersRouter);
app.use('/auth/', loginRouter);

app.use(function(err, req, res, next){
    /* NOTA: No quitarlo, así se emula el comportamiento original */
    console.log('Esto ha llegado a error, les aseguro');
    console.log(err.stack);
    
    let contenido = manejoErroresPeticion(err);
    let registro = registroError(req, contenido);
    return res
        .status(500)
        .json(registro);
});

module.exports = app;
