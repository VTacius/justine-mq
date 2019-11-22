let express = require('express');
let router = express.Router();
let loginMiddleware = require('../middlewares/auth');

router.get('/', loginMiddleware({authRequerido: true}), function(req, res){
	let mensaje = "Código";
	res.send(mensaje);

});

module.exports = router;