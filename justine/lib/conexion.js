const { manejoErroresPeticion } = require('justine/lib/utilidades') ;
const { Pool, Client } = require('pg');

class conexion {
    
    constructor(sa, za, pa, tokenz){
        
        this.claves = {};
        this.sa = sa;
        this.za = za;
        this.pa = pa;
        this.tokenz = tokenz
    }

    parserPsql(datos){
        let resultado = {};
        datos.forEach(function(item){
            let claveUsuario = (item.ru || item.du);
            delete item.ru;
            delete item.du;
            let attrsUsuario = item;
            if ('fecha_nacimiento' in item){
                item.fechaNacimiento = item.fecha_nacimiento;
                delete item.fecha_nacimiento;
            }
            resultado[claveUsuario] = attrsUsuario;
        }); 
        return resultado;
    }

    crearConsultaSql(tipo, tabla, datos, filtro){
        let consulta; 
        let parametros = [];
        
        if (tipo === 'UPDATE'){
            consulta = 'update ' + tabla + ' set ';
        }
        
        let num = 1;
        for (const k in datos){
            consulta += k + '=' + '$' + num + ','; 
            num += 1;
            parametros.push(datos[k]);
        }
        
        let sentencia = consulta.slice(0, -1) + ' where ' + filtro[0] + '=$' + num;
        parametros.push(filtro[1]);
        return [sentencia, parametros];
    };
    
    /* Esta rompe el orden: No debería ser asíncrona, debería usar una promesa, pero tengo el conect acá así que no */
    async conexionPsql(consulta, parametros){
        try {
            const resultado = await this.pa.query(consulta, parametros);
            return this.parserPsql(resultado.rows);
        }catch (error){
            return manejoErroresPeticion(error);
        }
    }
    
    conexionSamba(peticion){
        return this.sa(peticion)
            .then(function(respuesta){
                let contenido = respuesta;
                return contenido;
            })
            .catch(function(error){
                return manejoErroresPeticion(error);
            });
    }

    conexionZimbra(peticion, parser){
        let clavesZimbra = this.claves.zimbra;
        return this.za(peticion)
            .then(function(respuesta){
                let contenido = parser(respuesta.data, clavesZimbra);
                return contenido;
            })
            .catch(function(error){
                return manejoErroresPeticion(error);
            });
    }
    
    async dateadorPsql(consulta, parametros){
        const pc = await this.conexionPsql(consulta, parametros);
        
        // Si en este punto marcamos error, salimos
        if (pc.error){
            throw pc;
        }
        
        return pc;
    };

    async dateadorSamba(metodo, url, datos = false, parametros = false){
        let data = datos ? {'corpus': datos} : false;
        let sp = {
            method: metodo, 
            url,
            data,
            params: parametros
        }
        const sc = await this.conexionSamba(sp);

        // Si en este punto marcamos error, salimos
        if (sc.error){
            throw sc;
        }
        
        return sc;
    };
    
    async dateadorZimbra(metodo, url, parser, datos = false, parametros = false){
        let zp = {
            method: metodo,
            url,
            data: datos,
            params: parametros
        };
        let zc = await this.conexionZimbra(zp, parser); 
       
        if (zc.error){
            throw zc;
        }

        return zc;
    };

  
}

module.exports = conexion;
