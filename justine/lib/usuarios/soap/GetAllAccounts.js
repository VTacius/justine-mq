let cuerpoZimbra = require('justine/lib/zimbra.js');

let getAllAccounts = function(dominio, token) {
    let contenido = {
        "GetAllAccountsRequest": {
            "_attributes": {
                "xmlns": "urn:zimbraAdmin"
            },
            "domain": {
                "_attributes": {
                    "by": "name"
                },
                "_text": dominio
            }
        }
    }; 
    return cuerpoZimbra(contenido, token);
}

let parsearGetAllAccounts = function(datos, claves){
    let usuarios = datos['GetAllAccountsResponse']['account'];
    
    let resultado = {};
    
    usuarios.forEach(function(u){
        // TODO: Sin el split, usuario y dominio completo
        let claveUsuario = u['_attributes']['name'].split('@')[0];
        let attrsUsuario = {};
            
        u['a'].forEach(function(a){
            if (claves.includes(a["_attributes"]["n"])){
                attrsUsuario[a["_attributes"]["n"]] = a["_text"]; 
            }
        });
         
        resultado[claveUsuario] = attrsUsuario;
    });

    return resultado;
}
module.exports = { getAllAccounts, parsearGetAllAccounts };
