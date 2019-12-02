const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('./../../../app'); 
const expect = require('chai').expect;

chai.use(chaiHttp);

let agent = chai.request.agent(app)

describe('POST /usuarios', function(){
    before(async function(){
        const { USUARIOS_TESTING }  = require('./../../../configuracion.js'); 
        let credenciales = USUARIOS_TESTING.administrador;
        
        let response = await agent.post('/auth/login').send(credenciales);
        expect(response).to.have.cookie('connect.sid');
        expect(response).to.have.status(201);
    });
    
    it('No puedo crear usuario sin autenticarme', async function(){
        let contenido = require('./../../datos.json');
        let datos = contenido.usuarios[0] 
        
        let response = await chai.request(app).post('/usuarios').send(datos)
        expect(response).to.have.status(401);
    });
    
    it('Debería crear usuario', async function(){
        let contenido = require('./../../datos.json');
        let datos = contenido.usuarios[0] 
        
        let response = await agent.post('/usuarios').send(datos);
        expect(response).to.have.status(201);
    });

    it('No puedo crear un usuario que ya existe, al menos en samba', async function(){
        let contenido = require('./../../datos.json');
        let datos = contenido.usuarios[0] 
        
        let response = await agent.post('/usuarios').send(datos);
        expect(response).to.have.status(409);
    });

    it('Error específico cuando envío una petición sin datos', async function(){
        let response = await agent.post('/usuarios')
        expect(response).to.have.property('error');
        expect(response).to.have.status(400);
    });

    it('Error específico cuando envío insuficientes datos', async function(){
        let contenido = require('./../../datos.json');
        let datos = contenido.usuarios[1] 
        
        let response = await agent.post('/usuarios').send(datos);
        expect(response.body).to.include('givenName');
        expect(response.body).to.include('sn');
        expect(response.body).to.include('o');
        expect(response).to.have.status(400);
    });

    it('Puedo crear usuarios con un mínimo de información', async function(){
        let contenido = require('./../../datos.json');
        let datos = contenido.usuarios[2];
        
        let response = await agent.post('/usuarios').send(datos);
        expect(response).to.have.status(201);
    });
    
    after(async function(){
        let contenido = require('./../../datos.json');
        
        let username = contenido.usuarios[0].uid;
        let response = await agent.delete('/usuarios/' + username)
        expect(response).to.have.status(200);
        
        username = contenido.usuarios[2].uid;
        response = await agent.delete('/usuarios/' + username)
        expect(response).to.have.status(200);
        
        response = await agent.post('/auth/logout')
        expect(response).to.have.status(200);
    });
});

