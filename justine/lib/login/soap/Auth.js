let cuerpoZimbra = require('justine/lib/zimbra');

let authZimbra = function(usuario, password, dominio) {
    let contenido = {
        "AuthRequest": {
            "_attributes": {
                "xmlns": 'urn:zimbraAdmin'
            },
            "name": {
                "_text": usuario
            },
            "password": {
                "_text": password 
            },
            "virtualHost": {
                "_text": dominio 
            }
        }
    };

    return cuerpoZimbra(contenido, false);
}

let parsearAuthResponse = function(datos){
    let duracion = datos['AuthResponse']['lifetime']['_text'];
    let resultado =  datos['AuthResponse']['authToken']['_text'];
    return resultado;
}

module.exports = { authZimbra, parsearAuthResponse };
