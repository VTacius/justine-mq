let cuerpoZimbra = require('justine/lib/zimbra.js');

let getAccount = function(usuario, token, claves) {
    let attrs = claves.join(); 
    let contenido = {
        "GetAccountRequest": {
            "_attributes": {
                "xmlns": "urn:zimbraAdmin",
                "attrs": attrs,
            },
            "account": {
                "_attributes": {
                    "by": "name"
                },
                "_text": usuario
            }
        }
    }; 
    return cuerpoZimbra(contenido, token);
}

let parsearGetAccount = function(datos){
    let u = datos['GetAccountResponse']['account'];
    let resultado = {};
    
    // TODO: Sin el split, usuario y dominio completo
    let claveUsuario = u['_attributes']['name'].split('@')[0];
    let attrsUsuario = {};
    
    if (Array.isArray(u.a)){
        u.a.forEach(function(item){
            attrsUsuario[item['_attributes']['n']] = item['_text'];
        });
    } else {
        attrsUsuario[u.a['_attributes']['n']] =  u.a['_text'];
    }
    
    resultado[claveUsuario] = attrsUsuario;
    return resultado ;
}

module.exports = { getAccount, parsearGetAccount };
