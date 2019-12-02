const GRUPOS_MAPPING = { 
    'administrador': ["CN=Administrators,CN=Builtin,DC=psalud,DC=gob,DC=sv"],
    'tecnico': ["CN=DnsAdmins,CN=Users,DC=psalud,DC=gob,DC=sv"] 
};

const USUARIOS_TESTING = {
    usuario: {
        username: 'usuario',
        password: 'P@ssw0rd'
    },
    tecnico: {
        username: 'tecnico',
        password: 'P@ssw0rd'
    },
    administrador: {
        username: 'administrador',
        password: 'P@ssw0rd'
    },
} 

let configuracion = {
    session: {
        secret: 'FANTOCHE',
        resave: false,
        saveUninitialized: false
    },
    redisAcceso: {
        host: 'redis',
        port: '6379'
    },
    sambaApi: {
        baseURL: 'http://192.168.2.18:6543',
        headers: {'www-authorization': 'eyJyb2wiOiAiYWRtaW5pc3RyYWRvciIsICJkaXJlY2Npb24iOiAiYWxvcnRpeiJ9.3wR/qMGedccms7xFXN+GCbxlhbTknXGaBrtK3byOzJ0='}
    },
    zimbraApi: {
        baseURL: 'https://correo.salud.gob.sv:7071',
        headers:{
            'Content-Type': 'text/xml'
        },
        responseType: 'document', 
        
    },
    psqlAcceso: {
        host: 'postgres',
        user: 'postgres',
        database: 'maqueta',
        password: 'password',
    },
    credenciales: {
        zimbra: {
            usuario: 'api@salud.gob.sv',
            password: '123456',
        }
    }
};

module.exports = { GRUPOS_MAPPING, USUARIOS_TESTING, configuracion };
