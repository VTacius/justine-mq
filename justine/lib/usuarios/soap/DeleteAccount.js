let cuerpoZimbra = require('justine/lib/zimbra.js');

let deleteAccount = function(usuario, token){
    let contenido = {
        "DeleteAccountRequest": {
            "_attributes": {
                "xmlns": "urn:zimbraAdmin",
                "id": usuario
            },
        }
    }
    
    return cuerpoZimbra(contenido, token);
};

let parsearDeleteAccount = function(datos){
    let resultado = datos['DeleteAccountResponse'];

    return resultado;
};

module.exports = { deleteAccount, parsearDeleteAccount };
