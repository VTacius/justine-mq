const fs = require('fs');
const jwt = require('jsonwebtoken');

let clavePrivada = fs.readFileSync('./private.key');
let clavePublica = fs.readFileSync('./public.key');

let opcionesFirma = {
	issuer: 'Alexander Ortíz',
	subject: 'vtacius@dominio.com',
	audience: 'www.dominio.com',
	expiresIn: '2m',
	algorithm: 'RS256'
}

module.exports = {  
    crear: function(payload){
        try {
            return jwt.sign(payload, clavePrivada, opcionesFirma);
        } catch (error) {
            console.log(`Error: ${error.message}`);
            return false;  
        }
    },

    verificar: function(token){
        try {
            return jwt.verify(token, clavePublica, opcionesFirma) ;
        } catch (error) {
            console.log(`Error: ${error.message}`);
            return false;  
        }
    }
}
