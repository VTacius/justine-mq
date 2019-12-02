const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('./../../../app'); 
const expect = require('chai').expect;

chai.use(chaiHttp);

let agent = chai.request.agent(app)

describe('GET /usuarios', function(){
    before(async function(){
        const { USUARIOS_TESTING }  = require('./../../../configuracion.js'); 
        let credenciales = USUARIOS_TESTING.administrador;
        
        let response = await agent.post('/auth/login').send(credenciales);
        expect(response).to.have.cookie('connect.sid');
        expect(response).to.have.status(201);
    });
    
    it('Debería devolver usuarios', async function(){
        let response = await agent.get('/usuarios');
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf.above(3);
    });

    it('Debería devolver detalles de usuarios', async function(){
        let response = await agent.get('/usuarios/detalles');
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf.above(3);
    });
});

after(async function(){
    let response = await agent.post('/auth/logout');
    expect(response).to.have.status(200);
           
});
