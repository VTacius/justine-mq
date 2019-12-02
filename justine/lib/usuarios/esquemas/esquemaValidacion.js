const { checkSchema } = require('express-validator/check');

let usuarioEsquemaValidacion = checkSchema({
    buzonStatus: {
        optional: true,
        isBoolean: true,
        errorMessage: 'Debe ser booleano'
    },
    buzonVolumen: {
        optional: true,
        isInt: true,
        errorMessage: 'Debe ser un entero'
    }, 
    cuentaStatus: {
        optional: true,
        isBoolean: true,
        errorMessage: 'Debe ser booleano'
    },
    dui: {
        optional: true,
        matches: {
            options: /^(\d{8}-\d{1})*$/
        },
        errorMessage: 'Debe ser una cadena especial'
    },
    fecha: {
        errorMessage: 'Debe ser una fecha'
    },
    givenName: {
        errorMessage: 'Un string como cualquier otro'
    }, 
    grupo: {
        optional: true,
        isInt: true,
        errorMessage: 'Debe ser un entero'
    },
    grupos: {
        optional: true,
        custom: {
            options: function(valor){
                if (Array.isArray(valor)){
                    let resultado = valor.find(function(v){
                        return !Number.isInteger(v)
                    });
                    return !resultado
                }; 
                return false;
            }
        },
        errorMessage: 'Debe ser una lista enteros'
    },
    jvs: {
        optional: true,
        isInt: true,
        errorMessage: 'Debe ser un entero'
    },
    loginShell: {
        optional: true,
        isIn: {
            options: [['/bin/bash', '/bin/false']]
        },
        errorMessage: 'No es un valor válido'
    },
    mail: {
        optional: true,
        isEmail: true,
        errorMessage: 'Debe corresponde a una dirección de correo válida'
    },
    nit: {
        matches: {
            options: /^(\d{4}-\d{6}-\d{3}-\d{1}$)*$/
        },
        errorMessage: 'No en NIT Válido'
    },
    o: {
        optional: true,
        isInt: true,
        errorMessage: 'Debe ser un entero'
    },
    ou: {
        optional: true,
        isInt: true,
        errorMessage: 'Debe ser un entero'
    },
    pregunta: {
        errorMessage: 'Una cadena como cualquier otra'
    },
    respuesta: {
        errorMessage: 'Una cadena como cualquier otra'
    },
    sambaAcctFlags: {
        optional: true,
        isBoolean: true,
        errorMessage: 'Debe ser booleano'
    },
    sn: {
        errorMessage: 'Una cadena como cualquier otra'
    },
    telephoneNumber: {
        optional: true,
        matches: {
            options: /^(?:[0-9]+\-?){2}$/
        },
        errorMessage: 'No es un Número telefónico válido'
    },
    title: {
        errorMessage: 'Una cadena como cualquier otra'
    },
    uid: {
        matches: {
            options: /^[a-z]{3,15}$/
        },
        errorMessage: 'No cumple con los requerimientos para un UID'
    },
    uidNumber: {
        optional: true,
        isInt: true,
        errorMessage: 'Debe ser un entero'
    },
    userPassword: {
        optional: true,
        matches: {
            options: /^[A-Za-z0-9\.\_\%]{8,}$/
        },
        errorMessage: 'La contraseña no cumple los requerimientos de complejidad'
    }
});

/**
 * TODO: Lo de los requerimientos para la contraseña siempre vale la pena revisarlos
 */

module.exports = usuarioEsquemaValidacion; 
