const chai = require('chai'); 
const chaiHttp = require('chai-http');

const app = require('./../../../app');
const expect = require('chai').expect;

chai.use(chaiHttp);

let agent = chai.request.agent(app);
let tecnicoAgent = chai.request.agent(app);

let clavesNominales = ['dn','telephoneNumber', 'sAMAccountName', 'company', 'gidNumber', 'sn', 'department', 'givenName'];
let clavesExtendidas = ['dn', 'telephoneNumber', 'sAMAccountName', 'loginShell', 'company', 'gidNumber', 'sn', 'department', 'givenName', 'zimbraAccountStatus', 'zimbraMailDeliveryAddress', 'zimbraId', 'zimbraMailQuota', 'zimbraAuthLdapExternalDn', 'zimbraMailStatus', 'pregunta', 'respuesta', 'dui', 'fechaNacimiento', 'jvs', 'nit', 'userPassword'] 

describe('Perfil tecnico', function(){
  
    // Estas variables deberían ser comunes a todos las operaciones
    let contenido = require('./../../datos.json');
    let datos = contenido.usuarios[0]; 
    let username = datos.uid;
        
    before(async function(){
        // Autenticamos como un administrador
        const { USUARIOS_TESTING }  = require('./../../../configuracion.js'); 
        let credenciales = USUARIOS_TESTING.administrador;
        
        let response = await agent.post('/auth/login').send(credenciales)
        expect(response).to.have.cookie('connect.sid');
        expect(response).to.have.status(201);
       
        // Nos autenticamos con las credenciales de un tecnico
        let credencialesTecnico = USUARIOS_TESTING.tecnico;
        
        response = await tecnicoAgent.post('/auth/login').send(credencialesTecnico);
        expect(response).to.have.cookie('connect.sid');
        expect(response).to.have.status(201);
    
        // Creamos un usuario para probar tanto operaciones
        response = await agent.post('/usuarios').send(datos)
        expect(response).to.have.status(201);
        
    });
   
    it('Detallar todos los atributos: Puedo obtener todos los atributos de todos los usuarios', async function(){
        let response = await tecnicoAgent.get('/usuarios/detalles');
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf.above(3);
    });

    it('Detallar todos los atributos: Verifico consistencia de la respuesta', async function(){
        let response = await tecnicoAgent.get('/usuarios/detalles/' + username);
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.have.all.keys(clavesExtendidas);
    });

    after(async function(){
        // Borramos el usuario que hicimos para probar
        let response = await agent.delete('/usuarios/' + username)
        expect(response).to.have.status(200);
        
        // Cerramos la sessión del usuario normal que usamos para pruebas
        response = await tecnicoAgent.post('/auth/logout')
        expect(response).to.have.status(200);
        
        // Cerramos la sessión del administrador
        response = await agent.post('/auth/logout')
        expect(response).to.have.status(200);
    });

})

