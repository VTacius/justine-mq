
/*
 * Con este podés manejar información de los erroes que devuelva zimbra y samba
 * A usar en todos los operacion.js de cada entidad
 * */
const manejoErroresPeticion = function(error){
    /* Detalle debería componerse de todos los datos posibles, listo a ser almacenados en algún lugar */
    if (error.response) {
        let contenido = error.response.data;
        let detalle;
        if (contenido['soap:Fault']){
            let codigo = contenido['soap:Fault']['soap:Code']['soap:Value']['_text'];
            let razon = contenido['soap:Fault']['soap:Reason']['soap:Text']['_text'];
            detalle = contenido['soap:Fault']['soap:Detail']['Error'];
            contenido = {tipo: 'ZIMBRA', codigo, razon, detalle};
        } else if (contenido.message){
            let partes = contenido.message.split('\n')
            
            let codigo = contenido.code;
            let razon = partes[3] ? partes[3] : partes[0];
            detalle = contenido;
            contenido = {tipo: 'SAMBA', codigo, razon, detalle};
        }
        return {error: true, status: error.response.status, data: contenido, detalle}
    } else if (error.request) {
        let tipo = error.config.baseURL;
        
        let codigo = error.errno;  
        let razon = error.errno + ':' + error.syscall; 
        let detalle = (error.Error || error.message);
        contenido = {tipo, codigo, razon};
        return {error: true, status: 500, data: contenido, detalle}
    } else {
        let detalle = (error.stack || error);
        contenido = "Un error en la aplicación ha sucedido";
        return {error: true, status: 500, data: contenido, detalle};
    }
}

/*
 * La idea es almacenar información de los errores que ocurran
 * A usar en cada ruta de cada entidad
 * */
let registroError = function(req, error){
    /* NOTA: El siguiente log emula el comportamiento original*/
    //console.log(error);
    
    let operacion = req.method + ':' + req.originalUrl;
    let detalle;
    if (typeof error.data === 'object' && error.data.razon){
        detalle = error.data.razon;
        detalle['operacion'] = operacion;
    } else if (error.data){
        detalle = error.data;
    } else {
        detalle = error;
    }

    return detalle;
}

module.exports = { manejoErroresPeticion, registroError };
