const { createAccount, parsearCreateAccount } = require('justine/lib/usuarios/soap/CreateAccount');
const { getAccount, parsearGetAccount } = require('justine/lib/usuarios/soap/GetAccount');
const { getAllAccounts, parsearGetAllAccounts } = require('justine/lib/usuarios/soap/GetAllAccounts');
const { modifyAccount, parsearModifyAccount } = require('justine/lib/usuarios/soap/ModifyAccount');
const { deleteAccount, parsearDeleteAccount } = require('justine/lib/usuarios/soap/DeleteAccount');

const conexion = require('justine/lib/conexion');
const creadorContrasenia = require('justine/lib/usuarios/contrasenia');
const crearEsquema =  require('justine/lib//esquemas');
const esquemaSamba = require('justine/lib/usuarios/esquemas/esquemaSamba');
const esquemaZimbra = require('justine/lib/usuarios/esquemas/esquemaZimbra');
const { esquemaDBRecuperacion, esquemaDBDocumentos } = require('justine/lib/usuarios/esquemas/esquemaDB');

class userBase extends conexion {

    // TODO: ¿Es esta la forma en que deberías formatear la respuesta?, ¿Deberías tener una librería para tales cosas? 
    formatearRespuesta(sc, zc, pc, completo){
        let resultado = [];
        let contenido = 'mensaje' in sc.data ? sc.data.mensaje : sc.data; 
        contenido.forEach(function(usuario){
            let datosZimbra = zc[usuario.sAMAccountName];
            let datosPsql = pc[usuario.sAMAccountName];
            let entidad = Object.assign(usuario, datosZimbra, datosPsql);
            if(completo){
                entidad.userPassword = creadorContrasenia(usuario.sAMAccountName);
            }
            resultado.push(entidad);
        })
        return resultado ;
    }
   
    async verificar(dominio, usuario){
        const sc = await this.dateadorSamba('GET', '/usuarios/' + usuario);
        return {};
    };

    async obtener(dominio, usuario = false, claves = false, completo = false){

        this.claves = claves; 

        /* Es decir, no hemos especificado a un usuario, así que necesitamos todos los usuarios */
        let multiusuario = true ? !usuario : false; 

        let url = multiusuario ? '/usuarios' : '/usuarios/' + usuario;
        let parametros = claves ? {claves: claves.samba.join()} : {};
        const sc = await this.dateadorSamba('GET', url, false, parametros)
        
        let zc = {};
        let pc = {};
        let consulta = `select d.usuario as du, r.usuario as ru, r.pregunta, r.respuesta, d.dui, to_char(d.fecha_nacimiento, 'mm/dd/yyyy') as fecha_nacimiento, d.jvs, d.nit 
                            from jst_datos as d 
                            full outer join jst_recuperacion as r on d.usuario=r.usuario`;
        
        if (multiusuario && completo){
            let datosZimbra = getAllAccounts(dominio, this.tokenz, claves.zimbra);
            zc = await this.dateadorZimbra('POST', '/service/admin/soap', parsearGetAllAccounts, datosZimbra);  
            
            pc = await this.dateadorPsql(consulta, [])
        } else if(completo){
            let datosZimbra = getAccount(usuario, this.tokenz, claves.zimbra);
            zc = await this.dateadorZimbra('POST', '/service/admin/soap', parsearGetAccount, datosZimbra);  
            
            pc = await this.dateadorPsql(consulta + ' where r.usuario=$1 OR d.usuario=$1;', [usuario])
        } 

        return this.formatearRespuesta(sc, zc, pc, completo);
    
    }

    async cambiar(dominio, usuario, datos, claves){
       
        // Operación en SAMBA
        let datosSamba = crearEsquema(esquemaSamba, datos, claves.samba);
        let url = '/usuarios/' + usuario; 
      
        const sc = await this.dateadorSamba('PATCH', url, datosSamba);
        
        // Operacion en ZIMBRA
        let datosZimbra = crearEsquema(esquemaZimbra, datos);
        /* Si el esquema tiene datos propios de zimbra */
        if(Object.getOwnPropertyNames(datosZimbra).length > 0){
            /* Primero, obtenemos el id del usuario*/
            let requestZimbra = getAccount(usuario, this.tokenz, claves.zimbra);
            let zc = await this.dateadorZimbra('POST', '/service/admin/soap', parsearGetAccount, requestZimbra);
            
            let usuarioID = zc[usuario]['zimbraId'];
            /* Luego, podemos hacer la operación que precisamente necesitamos hacer */
            requestZimbra = modifyAccount(usuarioID, datosZimbra, this.tokenz);
            zc = await this.dateadorZimbra('POST', '/service/admin/soap', parsearModifyAccount, requestZimbra);
        }

        // Operacion en DB: Recuperación de contraseña
        let datosRecuperacion = crearEsquema(esquemaDBRecuperacion, datos);
        /* Si el esquema devuelve los dos datos precisos para la tabla de recuperación de datos */
        if(Object.getOwnPropertyNames(datosRecuperacion).length == 2){
            let consulta = 'update jst_recuperacion set pregunta=$1, respuesta=$2 where usuario=$3';
            let pc = await this.dateadorPsql(consulta, [datosRecuperacion.pregunta, datosRecuperacion.respuesta, usuario])
            
        }
       
        // Operacion en DB: Datos de ID
        let datosDocumentos = crearEsquema(esquemaDBDocumentos, datos);
        /* Si el esquema devuelve datos propios de Documentos ID */
        if(Object.getOwnPropertyNames(datosDocumentos).length > 0){
            let consulta = this.crearConsultaSql('UPDATE', 'jst_datos', datosDocumentos, ['usuario', usuario]);
            let pc = await this.dateadorPsql(...consulta);
        }
        
        return sc
    }

}

class userUsuario extends userBase {
    async listar(dominio, usuario){
        /* TODO: Con caracter de urgencia, te aviso que falta el uso actual del buzón */
        let claves = { 
            samba: ['givenName', 'grupo', 'grupos', 'mail', 'o', 'ou', 'sn', 'telephoneNumber', 'title', 'sAMAccountName'], 
            zimbra: []
        };  
        
        return this.obtener(dominio, usuario, claves)
            .then(function(contenido){
                return contenido;
            })
            .catch(function(error){
                throw error;
            });
    }
    
    async detallar(dominio, usuario){
        /* TODO: Con caracter de urgencia, te aviso que falta el uso actual del buzón */
        let claves = { 
            samba: ['givenName', 'grupo', 'grupos', 'loginShell', 'mail', 'o', 'ou', 'sambaAcctFlags', 'sn', 'telephoneNumber', 'title', 'uid', 'userPassword', 'sAMAccountName'], 
            zimbra: ['zimbraId', 'zimbraMailQuota', 'zimbraMailStatus', 'zimbraAccountStatus', 'zimbraMailDeliveryAddress', 'zimbraAuthLdapExternalDn']
        };  
        
        return this.obtener(dominio, usuario, claves, true)
            .then(function(contenido){
                return contenido;
            })
            .catch(function(error){
                throw error;
            });
    }
    
    async actualizar(dominio, usuario, datos){
        /* TODO: Con caracter de urgencia, te aviso que falta el uso actual del buzón */
        let claves = { 
            samba: ['givenName', 'o', 'ou', 'sn', 'telephoneNumber', 'title', 'userPassword'], 
            zimbra: ['givenName', 'o', 'ou', 'sn', 'telephoneNumber', 'title', 'zimbraId']
        };  
        return this.cambiar(dominio, usuario, datos, claves)
            .then(function(contenido){
                return usuario;
            })
            .catch(function(error){
                throw error;
            });
    }
}

class userTecnico extends userUsuario {
}


class userAdministrador extends userTecnico {
    async crear(dominio, datos){

        // Este lo vamos a ir necesitando luego. Considera que a uid lo borramos para usarlo en zimbra
        let username = datos.uid;
        let password = creadorContrasenia(username);
        datos.userPassword = password;

        // Operación en SAMBA
        let datosSamba = crearEsquema(esquemaSamba, datos);
        const sc = await this.dateadorSamba('POST', '/usuarios', datosSamba);

        // Operacion en ZIMBRA
        let usuario = username + '@' + dominio; 
        datos['zimbraAuthLdapExternalDn'] = sc.data.mensaje;
        
        let datosZimbra = crearEsquema(esquemaZimbra, datos);
        let requestZimbra = createAccount(usuario, password, datosZimbra, this.tokenz);
        const zc = await this.dateadorZimbra('POST', '/service/admin/soap', parsearCreateAccount, requestZimbra);
       
        let consulta = 'insert into jst_datos(usuario, dui, fecha_nacimiento, jvs, nit) values($1, $2, $3, $4, $5);';
        let pc = await this.dateadorPsql(consulta , [username, datos.dui, datos.fechaNacimiento, datos.jvs, datos.nit])
        
        consulta = 'insert into jst_recuperacion(usuario) values($1)';
        pc = await this.dateadorPsql(consulta, [username]);

        return {username, password};
    }
    
    async actualizar(dominio, usuario, datos){
        /* TODO: Con caracter de urgencia, te aviso que falta el uso actual del buzón */
        let claves = { 
            samba: ['givenName', 'grupo', 'grupos', 'loginShell', 'mail', 'o', 'ou', 'sambaAcctFlags', 'sn', 'telephoneNumber', 'title', 'uid', 'userPassword'], 
            zimbra: ['zimbraId', 'zimbraMailQuota', 'zimbraMailStatus', 'zimbraAccountStatus', 'zimbraMailDeliveryAddress', 'zimbraAuthLdapExternalDn']
        };  
        
        return this.cambiar(dominio, usuario, datos, claves)
            .then(function(contenido){
                return usuario;
            })
            .catch(function(error){
                throw error;
            });
    }

    async borrar(dominio, usuario){
        // Operacion SAMBA
        const sc = await this.dateadorSamba('DELETE', '/usuarios/' + usuario );

        // Operacion Zimbra
        let requestZimbra = getAccount(usuario, this.tokenz, ['zimbraId']);
        let zc = await this.dateadorZimbra('POST', '/service/admin/soap', parsearGetAccount, requestZimbra);
        
        let usuarioID = zc[usuario]['zimbraId'];
      
        requestZimbra = deleteAccount(usuarioID, this.tokenz);
        zc = await this.dateadorZimbra('POST', '/service/admin/soap', parsearDeleteAccount, requestZimbra);
        
        // Operacion psql
        let consulta = 'delete from jst_datos where usuario=$1';
        let pc = await this.dateadorPsql(consulta , [usuario])

        consulta = 'delete from jst_recuperacion where usuario=$1';
        pc = await this.dateadorPsql(consulta , [usuario])
        
        return usuario;
    }

}

let instanciarUsuario = function(roles, sambaApi, zimbraApi, psqlAcceso, tokenz){
    if (roles.includes('administrador')){
        return new userAdministrador(sambaApi, zimbraApi, psqlAcceso, tokenz);
    } else if (roles.includes('tecnico')){
        return new userTecnico(sambaApi, zimbraApi, psqlAcceso, tokenz);
    } else if (roles.includes('usuario')){
        return new userUsuario(sambaApi, zimbraApi, psqlAcceso, tokenz);
    } else {
        console.log('Nada con el rol', rol);
    }
}

module.exports = instanciarUsuario;
