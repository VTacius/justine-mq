let cuerpoZimbra = require('justine/lib/zimbra.js');

let modifyAccount = function(usuarioID, datos, token){
    /* Estas repetido con la creación de cuentas */
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
        "ModifyAccountRequest": {
            "_attributes": {
                "xmlns": "urn:zimbraAdmin",
                "id": usuarioID,
            },
            "a": datosUsuario 
        }
    };

    return cuerpoZimbra(contenido, token);

};

let parsearModifyAccount = function(datos){

    let resultado = datos['ModifyAccountResponse']['account']['_attributes'];

    return resultado;
};

module.exports = { modifyAccount, parsearModifyAccount };
