let cuerpoZimbra = function(cuerpo, token=false){
    let contexto = {
        "_attributes": {
            "xmlns": "urn:zimbra"
        },
        "format": {
            "_attributes": {
                "type": "xml"
            }
        }
    };
    
    if(token){
        contexto['authToken'] = token; 
    }
    
    return {
        "_declaration": {
            "_attributes": {
                "version": "1.0"
            }
        },
        "soap:Envelope": {
            "_attributes": {
                "xmlns:soap": "http://www.w3.org/2003/05/soap-envelope"
            },
            "soap:Header": {
                "context": contexto
            },
            "soap:Body": cuerpo 
        }
    }
}

module.exports = cuerpoZimbra;
