let express = require('express');
let router = express.Router();

let token = require('../lib/token');
let auth = require('../lib/auth');
let validar = require('../lib/validacion');
let loginMiddleware = require('../middlewares/auth');

let config = {usuario: ['requerido', 'sustantivo'], password: ['requerido']};

router.post('/auth', validar(config), loginMiddleware({authRequerido: false}), function(req, res){
	let usuario = req.body.usuario;
	let password = req.body.password;
	if (auth.autenticar(usuario, password)){
		let jwtToken = token.crear(auth.payload);
		console.log(auth.datos);
		res.json({
			success: true,
			gecos: auth.datos.gecos,
			rol: auth.datos.rol,
			token: jwtToken
		});
	} else {
		res.status(401).json({
			sucess: false,
		});
	}

});

module.exports = router;
