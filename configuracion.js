const GRUPOS_MAPPING = { 
    'administrador': ["CN=Administrators,CN=Builtin,DC=minsal,DC=sanidad,DC=gob,DC=sv"],
    'tecnico': ["CN=DnsAdmins,CN=Users,DC=minsal,DC=sanidad,DC=gob,DC=sv"] 
};

const USUARIOS_TESTING = {
    usuario: {
        username: 'usuario',
        password: 'S4mb1t4.12'
    },
    tecnico: {
        username: 'tecnico',
        password: 'S4mb1t4.12'
    },
    administrador: {
        username: 'administrador',
        password: 'S4mb1t4.12'
    },
} 

let configuracion = {
    session: {
        secret: 'FANTOCHE',
        resave: false,
        saveUninitialized: false
    },
    redisAcceso: {
        host: '127.0.0.1',
        port: '6379'
    },
    sambaApi: {
        dominio: 'sanidad.gob.sv',
        acceso: { 
            baseURL: 'http://10.10.40.10:6543',
            headers: {'www-authorization': 'eyJkaXJlY2Npb24iOiAiYWxvcnRpeiIsICJyb2wiOiAiYWRtaW5pc3RyYWRvciJ9.hzvtUYQRaaxa/lCktpkx6l99xj8c5aA/aitHWOg4j0s='}
        },
    },
    zimbraApi: {
        baseURL: 'https://correo.sanidad.gob.sv:7071',
        headers: {'Content-Type': 'text/xml'},
        responseType: 'document', 
        
    },
    psqlAcceso: {
        host: '10.10.40.14',
        user: 'justine',
        database: 'justine',
        password: 'justine',
    },
    credenciales: {
        zimbra: {
            usuario: 'api.gzovbbbqznqm@sanidad.gob.sv',
            password: 'P.4ssw0rd',
        }
    }
};

module.exports = { GRUPOS_MAPPING, USUARIOS_TESTING, configuracion };
