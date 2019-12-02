const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('./../../../app'); 
const expect = require('chai').expect;

chai.use(chaiHttp);

let agent = chai.request.agent(app)

describe('PUT /usuarios', function(){
    before(async function(){
        const { USUARIOS_TESTING }  = require('./../../../configuracion.js'); 
        let credenciales = USUARIOS_TESTING.administrador;
        
        let response = await agent.post('/auth/login').send(credenciales)
        expect(response).to.have.cookie('connect.sid');
        expect(response).to.have.status(201);
        
        let contenido = require('./../../datos.json');
        let datos = contenido.usuarios[0];
        response = await agent.post('/usuarios').send(datos);
        expect(response).to.have.status(201);
    });

    it('Debería dar un mensaje al cambiar datos del usuario', async function(){
        let contenido = require('./../../datos.json');
        let datos = contenido.usuarios[0];
        datos.sn = 'Aguirre Figueroa';
        
        let response = await agent.put('/usuarios/' + datos.uid).send(datos)
        expect(response).to.have.status(200);
        expect(response.body).to.have.keys('data');
        expect(response.body.data).to.contains(datos.uid);
    });

    it('Debería cambiar todos los datos que le enviamos', async function(){
        let contenido = require('./../../datos.json');
        let datos = contenido.usuarios[0];
        datos.sn = 'Aguirre Figueroa';
        datos.givenName = 'Gabriela Esperanza';
        
        let response = await agent.put('/usuarios/' + datos.uid).send(datos);
        expect(response).to.have.status(200);

        response = await agent.get('/usuarios/' + datos.uid);
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.include.keys('sn', 'givenName');
        expect(response.body[0].sn).to.equal(datos.sn);
        expect(response.body[0].givenName).to.equal(datos.givenName);
    });

    it('Debería cambiar datos parciales', async function(){
        let contenido = require('./../../datos.json');
        let username = contenido.usuarios[0].uid;
        let sn = 'Aguirre Espinoza';
        let givenName = 'Manuela Esperanza';
        let datos = {uid: username, sn, givenName}
        
        let response = await agent.put('/usuarios/' + username).send(datos);
        expect(response).to.have.status(200);

        response = await agent.get('/usuarios/' + datos.uid);
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf(1);
        expect(response.body[0]).to.include.keys('sn', 'givenName');
        expect(response.body[0].sn).to.equal(sn);
        expect(response.body[0].givenName).to.equal(givenName);
    });

    after(async function(){
        let contenido = require('./../../datos.json');
        let username = contenido.usuarios[0].uid;
        
        let response = await agent.delete('/usuarios/' +  username)
        expect(response).to.have.status(200);
        
        await agent.post('/auth/logout')
        expect(response).to.have.status(200);
    });
});
