const conexion = require('justine/lib/conexion');
const { GRUPOS_MAPPING } = require('./../../configuracion');
const { authZimbra, parsearAuthResponse } = require('justine/lib/login/soap/Auth');

let grupeante = function(grupos){
    /**
     * Retorna un un rol para el usuario según los grupos que tenga disponible
     */

    if (!grupos){
        return ['usuario'];
    }

    let ambiente = this;

    let roles = [];
    grupos.forEach(function(grupo){
        let grps = Object.keys(GRUPOS_MAPPING);
        roles = grps.filter(function(g){
            let res = GRUPOS_MAPPING[g].find(function(item){
                return item === grupo;
            });
            return res;
        });
    }, this);

    return roles.length === 0 ? ['usuario']: roles;
};

class logueo extends conexion {
    constructor(sa, za, tokenz){
        super();
        
        this.sa = sa;
        this.za = za;
        this.tokenz = tokenz
    }
   
    async loginZimbra(usuario, password, dominio){
        let requestZimbra = authZimbra(usuario, password, dominio);
        let zp = {
            method: 'POST',
            url: '/service/admin/soap',
            data: requestZimbra
        } 
        const zc = await this.conexionZimbra(zp, parsearAuthResponse);
        
        if (zc.error){
            throw zc.data;
        }
        
        return zc;
    
    }
    
    async login(zimbraCreds, usuario, password, dominio){
        let data = { usuario, password };
        let sp = {
            method: 'POST',
            url: '/auth/login',
            data
        };
        const sc = await this.conexionSamba(sp);
        
        if (sc.error){
            throw sc.data;
        }
       
        let roles = grupeante(sc.data.grupos);
        let datos = {usuario, displayName: sc.data.displayName, roles};
       
        /* Todos los usuarios necesitan un token de administrador zimbra, para lo que puedan necesitar */
        datos['tokenz'] = await this.loginZimbra(zimbraCreds.usuario, zimbraCreds.password, dominio); 
        return datos;
    }
}

module.exports = logueo;
