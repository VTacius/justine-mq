/*
 * esquema
 * datos
 * 
 * Retorna los datos que un esquema datos realmente necesita
 * */

/* La clave del valor necesita cambiar de nombre*/
let nombrador = function(clave, item){
    if (typeof(item.traduccion) === 'string'){
        return item.traduccion;
    } else {
        return clave;
    }
}

/* ¿El valor necesita cambiar de tipo */
let conteneador = function(datos, item){
    if (typeof(item.transformacion) === 'function'){
        let transformacion = item.transformacion;
        return transformacion(datos);
    } else {
        return datos; 
    }
    
}

let crearEsquema = function(esquema, datos, claves=false){
    let resultado = {};
    let llaves = Array.isArray(claves) === Array ? claves : Object.keys(esquema);
    
    llaves.forEach(function(clave){
        if (datos.hasOwnProperty(clave)){
            let item = esquema[clave];
            let contenido = conteneador(datos[clave], item);
            let nombre = nombrador(clave, item);

            resultado[nombre] = contenido;
        }
    
    }, this);
    
    return resultado
}; 


module.exports = crearEsquema ;
