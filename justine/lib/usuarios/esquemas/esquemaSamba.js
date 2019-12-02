let cadena = function(valor){
    return valor.toString();
};

let listaCadenas = function(valor){
    return valor.map(function(item){
        return item.toString();
    });
}; 

let usuarioEsquemaSamba = {
    givenName: {},
    grupo: {
        transformacion: cadena 
    },
    grupos: {
        transformacion: listaCadenas
    },
    loginShell: {},
    mail: {},
    o: {
        transformacion: cadena 
    },
    ou: {
        transformacion: cadena 
    },
    sambaAcctFlags: {},
    sn: {},
    telephoneNumber: {},
    title: {},
    uid: {},
    userPassword: []

}

module.exports = usuarioEsquemaSamba; 
