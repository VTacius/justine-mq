let cuerpoZimbra = require('justine/lib/zimbra.js');

let createAccount = function(usuario, password, datos, token) {
    /* Estas repetido con la modificación de cuentas */
    let datosUsuario = [];
    
    for (const k in datos){
        let item = {
            "_attributes": {
                "n": k
            },
            "_text": datos[k]
        };
        datosUsuario.push(item); 
    }
    
    let contenido = {
        "CreateAccountRequest": {
            "_attributes": {
                "xmlns": "urn:zimbraAdmin",
                "name": usuario,
                "password": password
            },
            "a": datosUsuario 
        }
    }; 
    
    return cuerpoZimbra(contenido, token);
};

let parsearCreateAccount = function(datos){
    
    let resultado = datos['CreateAccountResponse']['account']['_attributes'];
    
    return resultado;
};

module.exports = { createAccount, parsearCreateAccount };
