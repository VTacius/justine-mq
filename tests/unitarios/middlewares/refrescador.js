const chai = require('chai');

const app = require('./../../../app'); 
const expect = require('chai').expect;

const { token_fuera_tiempo } = require('justine/middlewares/refrescador');

let con;

describe('Middleware refrescador', function(){
    it('Token fuera de tiempo: Caso base', function(){
        let actual = new Date();
        let pasado_ts = 1000 *( (11*60*60) + (50*60) ) + 1;
        let pasado = actual - pasado_ts;
        let ts = new Date(pasado);
        
        let response = token_fuera_tiempo(ts);
        expect(response).to.be.equal(true);
    });
    
    it('Token fuera de tiempo: Justo a tiempo', function(){
        let actual = new Date();
        let pasado_ts = (1000 *( (11*60*60) + (50*60) )) - 2;
        let pasado = actual - pasado_ts;
        let ts = new Date(pasado);
        
        let response = token_fuera_tiempo(ts);
        expect(response).to.be.equal(false);
    });
    
    it('Token fuera de tiempo: Tipo incorrecto', function(){
        let ts = 'Cadena no convertible a tiempo';  
        let response = token_fuera_tiempo(ts);
        expect(response).to.be.equal(false);
    });
});
