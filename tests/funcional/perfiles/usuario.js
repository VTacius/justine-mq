const chai = require('chai'); 
const chaiHttp = require('chai-http');

const app = require('./../../../app');
const expect = require('chai').expect;

chai.use(chaiHttp);

let agent = chai.request.agent(app);
let usuarioAgent = chai.request.agent(app);

let clavesNominales = ['dn','telephoneNumber', 'sAMAccountName', 'company', 'gidNumber', 'sn', 'department', 'givenName'];
let clavesExtendidas = ['dn', 'telephoneNumber', 'sAMAccountName', 'loginShell', 'company', 'gidNumber', 'sn', 'department', 'givenName', 'zimbraAccountStatus', 'zimbraMailDeliveryAddress', 'zimbraId', 'zimbraMailQuota', 'zimbraAuthLdapExternalDn', 'zimbraMailStatus', 'pregunta', 'respuesta', 'dui', 'fechaNacimiento', 'jvs', 'nit', 'userPassword'] 

describe('Perfil usuario', function(){
   
    before(async function(){
        // Autenticamos como un administrador
        const { USUARIOS_TESTING }  = require('./../../../configuracion.js'); 
        let credenciales = USUARIOS_TESTING.administrador;
        
        let response = await agent.post('/auth/login').send(credenciales)
        expect(response).to.have.cookie('connect.sid');
        expect(response).to.have.status(201);
    
        // Creamos un usuario para probar tanto operaciones como el perfil
        let contenido = require('./../../datos.json');
        let datos = contenido.usuarios[0];
       
        response = await agent.post('/usuarios').send(datos)
        expect(response).to.have.status(201);
        let credencialesUsuario = response.body;
       
        // Nos autenticamos con el usuario recién creado
        response = await usuarioAgent.post('/auth/login').send(credencialesUsuario);
        expect(response).to.have.cookie('connect.sid');
        expect(response).to.have.status(201);
    });
   
    it('Listar algunos atributos', async function(){
        let contenido = require('./../../datos.json');
        let usuario = contenido.usuarios[0];
        let username = usuario.uid;

        let response = await usuarioAgent.get('/usuarios/' + username)
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.have.all.keys(...clavesNominales);
    });

    it('Listar algunos atributos: Uso de /detalles/ sobre el objeto que le representa', async function(){
        let contenido = require('./../../datos.json');
        let datos = contenido.usuarios[0];
        let username = datos.uid;

        let response = await usuarioAgent.get('/usuarios/detalles/' + username)
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.have.all.keys(...clavesExtendidas)
    });
    
    it('Listar algunos atributos: No puedo usar /detalles/ para listar', async function(){
        let response = await usuarioAgent.get('/usuarios/detalles/')
        expect(response).to.have.status(403);
    });
    
    it('Listar algunos atributos: No puedo usar /detalles/ para usuarios especificos', async function(){
        let response = await usuarioAgent.get('/usuarios/detalles/administrador')
        expect(response).to.have.status(403);
    });

    it('Modificar [ALGUNAS] propiedades del objeto que le representa: Devuelve un mensaje apropiado', async function(){
        let contenido = require('./../../datos.json');
        let datos = contenido.usuarios[0];
        let username = datos.uid;
        datos.sn = 'Aguirre Ochoa';

        let response = await usuarioAgent.put('/usuarios/' + username).send(datos)
        expect(response).to.have.status(200);
        expect(response.body).to.have.all.keys('data');
    });
    
    it('Modificar [ALGUNAS] propiedades del objeto que le representa: Revisamos los cambios hechos ', async function(){
        let contenido = require('./../../datos.json');
        let username = contenido.usuarios[0].uid;
        let sn = 'Aguirre Espinoza';
        let givenName = 'Manuela Esperanza';
        let datos = {uid: username, sn, givenName}

        let response = await usuarioAgent.put('/usuarios/' + username).send(datos)
        expect(response).to.have.status(200);
        expect(response.body).to.have.all.keys('data');
       
        response = await usuarioAgent.get('/usuarios/' + username);
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.include.keys('sn', 'givenName');
        expect(response.body[0].sn).to.equal(sn);
        expect(response.body[0].givenName).to.equal(givenName);
    });
    
    it('Modificar [ALGUNAS] propiedades del objeto que le representa: Cambiar contraseña', async function(){
        let contenido = require('./../../datos.json');
        let username = contenido.usuarios[0].uid;
        let userPassword = 'P4ss0rd.C0ntr4s3n14';
        let datos = {uid: username, userPassword}

        let response = await usuarioAgent.put('/usuarios/' + username).send(datos);
        expect(response).to.have.status(200);
        
        let trivialAgente = chai.request.agent(app);
        let credenciales = {username, password: userPassword};
        
        response = await trivialAgente.post('/auth/login').send(credenciales);
        expect(response).to.have.cookie('connect.sid');
        expect(response).to.have.status(201);
        
        response = await trivialAgente.post('/auth/logout')
        expect(response).to.have.status(200);
    });
    
    it('Modificar [ALGUNAS] propiedades del objeto que le representa: Datos de recuperacion', async function(){
        let contenido = require('./../../datos.json');
        let username = contenido.usuarios[0].uid;
        let pregunta = '¿Quien soy?';
        let respuesta = 'Alguien, supongo';
        let datos = {uid: username, pregunta, respuesta}

        let response = await usuarioAgent.put('/usuarios/' + username).send(datos)
        expect(response).to.have.status(200);
       
        response = await usuarioAgent.get('/usuarios/detalles/' + username);
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.include.keys('pregunta', 'respuesta');
        expect(response.body[0].pregunta).to.equal(pregunta);
        expect(response.body[0].respuesta).to.equal(respuesta);
    });
    
    it('Modificar [ALGUNAS] propiedades del objeto que le representa: Cambios parciales en datos sobre documentos de identificación', async function(){
        let contenido = require('./../../datos.json');
        let username = contenido.usuarios[0].uid;
        let nit = contenido.usuarios[0].nit;
        let fechaNacimiento = contenido.usuarios[0].fechaNacimiento;
        let dui = '98765432-1';
        let datos = {uid: username, dui}

        let response = await usuarioAgent.put('/usuarios/' + username).send(datos)
        expect(response).to.have.status(200);
       
        response = await usuarioAgent.get('/usuarios/detalles/' + username);
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.include.keys('dui', 'nit');
        expect(response.body[0].dui).to.equal(dui);
        expect(response.body[0].nit).to.equal(nit);
        expect(response.body[0].fechaNacimiento).to.equal(fechaNacimiento);
    });
    
    it('Modificar [ALGUNAS] propiedades del objeto que le representa: Datos sobre documentos de identificación', async function(){
        let contenido = require('./../../datos.json');
        let username = contenido.usuarios[0].uid;
        let dui = '98765432-1';
        let nit = '5555-777777-444-2';
        let datos = {uid: username, dui, nit}

        let response = await usuarioAgent.put('/usuarios/' + username).send(datos)
        expect(response).to.have.status(200);
       
        response = await usuarioAgent.get('/usuarios/detalles/' + username);
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.include.keys('dui', 'nit');
        expect(response.body[0].dui).to.equal(dui);
        expect(response.body[0].nit).to.equal(nit);
    });
    
    after(async function(){
        // Borramos el usuario que hicimos para probar
        let contenido = require('./../../datos.json');
        let username = contenido.usuarios[0].uid;
        
        let response = await agent.delete('/usuarios/' + username)
        expect(response).to.have.status(200);
        
        // Cerramos la sessión del usuario normal que usamos para pruebas
        response = await usuarioAgent.post('/auth/logout')
        expect(response).to.have.status(200);
        
        // Cerramos la sessión del administrador
        response = await agent.post('/auth/logout')
        expect(response).to.have.status(200);
    });

})

