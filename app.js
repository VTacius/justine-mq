let express = require('express');
let cors = require('cors');
let app = express();

/** Traemos las vistas  */
const login = require('./src/vistas/login');
const index = require('./src/vistas/index')

let corsOptions = {
	origin: 'http://127.0.0.1:8080',
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/', index);
app.use('/login', login);

app.listen(3000, function(){
	console.log('La aplicación empieza');
});
