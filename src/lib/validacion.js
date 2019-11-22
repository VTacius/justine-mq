class Validacion {
    constructor(configuracion){
        this.configuracion = configuracion;
        this.errores = [];
    }

    procesarValidaciones(nombre, valor, requerimientos){
        let errores = requerimientos.map(function(requerimiento){
            if (requerimiento in this){
                let resultado = this[requerimiento](valor);
                return {nombre, resultado, requerimiento};
            } else {
                let resultado = false;
                return {nombre, resultado, requerimiento};
            }
        }, this).map(elemento => elemento.requerimiento);
        
        return errores;
    }

    validar(destino){
        let errores = Object.entries(this.configuracion).map(function(item){
            let [nombre, requerimientos] = item;
            if (nombre in destino){
                return this.procesarValidaciones(nombre, destino[nombre], requerimientos);
            } else {
                return {nombre, resultado: true, requerimiento: ['noexistente']};
            }
        }, this)
        .filter(elemento => elemento.resultado);
        
        this.errores = errores;

        return errores.length === 0;
    }

    /** 
     * Paradoja: Devuelven false si pasan la prueba
     */

    requerido = function(){
        let [valor] = arguments;
        return false;
    }
}

let validar = function(configuracion, dst){
    return function(req, res, next){
        let v = new Validacion(configuracion);
        let destino = (dst in req) ? req[dst] : req.body;
        if(v.validar(destino)){
            next();
        } else {
            console.log('Hay errores en la validacion');
            res.status(400).json({
                success: false
            });
        }
    }
}
module.exports = validar;