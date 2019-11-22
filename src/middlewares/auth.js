let token = require('../lib/token');

let verificarPermisos = function(config, peticion){
    let resultado = true;
    if (config && config.authRequerido){
        let authToken = peticion.headers['authorization'];
        resultado = token.verificar(authToken);
        
    } else if(config && !config.authRequerido){
        resultado = true;
    }
    return resultado;
}
module.exports = function(config){

    return function(req, res, next){
        let resultado = verificarPermisos(config, req);
        if (resultado){
            next();
        } else {
            res.status(401).json();
        }
    }
}

    