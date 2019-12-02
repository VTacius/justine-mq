const chai = require('chai');

const app = require('./../../../app');
const expect = require('chai').expect;

const crearEsquema = require('justine/lib/esquemas');

let esquema = {
    nombre: {},
    apellido: {}
}; 

let datos = {
    nombre: 'Claudia',
    apellido: 'Ortega'
};

describe('Creador de esquema', function(){
    it('Valida un conjunto de datos: Caso base', function(){
        let response = crearEsquema(esquema, datos);
        expect(response).to.be.eql(datos);
    });

    it('Valida un conjunto de datos: Elimina claves', function(){
        let datosef = {
            nombre: datos.nombre, 
            apellido: datos.apellido, 
            efimero: 'Contenido Efímero a borrar'
        };
       
        let response = crearEsquema(esquema, datosef);
        expect(response).to.be.eql(datos);
    });
    
    it('Valida un conjunto de datos: Traduce claves', function(){
        let esquemaef = {
            nombre: {
                traduccion: 'sustantivo'
            },
            apellido: {}
        }; 
        
        let response = crearEsquema(esquemaef, datos);
        expect(response).to.have.all.keys('sustantivo', 'apellido');
    });

    it('Valida un conjunto de datos: Tranforma contenido', function(){
        let esquemaef = {
            nombre: {
                transformacion: function(contenido){
                    return contenido.toUpperCase();
                }
            },
            apellido: {}
        }; 
        
        let nombre = datos.nombre.toUpperCase(); 
        let response = crearEsquema(esquemaef, datos);
        expect(response.nombre).to.be.equal(nombre);
    });
    
    it('Valida un conjunto de datos: Verifica cambios descritos en esquema', function(){
        let esquemaef = {
            nombre: {
                transformacion: "nulo",
                traduccion: 1
            },
            apellido: {}
        }; 
        
        let nombre = datos.nombre.toUpperCase(); 
        let response = crearEsquema(esquemaef, datos);
        expect(response).to.be.eql(datos);
    });
});
