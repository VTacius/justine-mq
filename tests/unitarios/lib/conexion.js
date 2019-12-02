const chai = require('chai');

const app = require('./../../../app'); 
const expect = require('chai').expect;

const conexion = require('justine/lib/conexion');

let con;

describe('Clase conexión', function(){
    before(function(){
        con = new conexion(false, false, false, false);
    });

    it('Debería formar una sentencia UPDATE válida: Caso base', function(){
        let datos = {'userPassword': 'P4ssw0rd'};
        let filtro = ['usuario', 'tecnsup'];
        let consulta = 'update jst_prueba set userPassword=$1 where usuario=$2';
        let parametros = ['P4ssw0rd', 'tecnsup'];

        let response = con.crearConsultaSql('UPDATE', 'jst_prueba', datos, filtro);
        expect(response[0]).to.be.equal(consulta);
        expect(response[1]).to.have.members(parametros);
    });
    
    it('Debería formar una sentencia UPDATE válida', function(){
        let userPassword = 'P4ssw0rd';
        let nombre = 'Gabriela'; 
        let apellido = 'Saravia'; 
        let datos = {userPassword, nombre, apellido};
        let filtro = ['usuario', 'tecnsup'];
        
        let consulta = 'update jst_prueba set userPassword=$1,nombre=$2,apellido=$3 where usuario=$4';
        let parametros = [userPassword, nombre, apellido, 'tecnsup'];

        let response = con.crearConsultaSql('UPDATE', 'jst_prueba', datos, filtro);
        expect(response[0]).to.be.equal(consulta);
        expect(response[1]).to.have.members(parametros);
    });
    
})
