const logueo = require('justine/controladores/login');

let token_fuera_tiempo = function(ts){
    let ts_session_data = ts ? ts : 1500000000000;
    let ts_session_fecha = new Date(ts_session_data);
    let fecha = new Date();
    
    let tiempo = fecha - ts_session_fecha;
    
    return tiempo > 42600000;
};

/*
 * Si estamos próximos a cumplir las doce horas desde el último login, pues refresca el token para zimbra
 * */
let refrescador = function(req, res, next){
    let ts = req.session.ts;
    if (token_fuera_tiempo(ts)){
        let zimbraCreds = req.app.get('zimbraCreds');
        let sambaApi = req.app.get('sambaApi');
        let zimbraApi = req.app.get('zimbraApi');
        let tokenz = req.session.tokenz;
        let dominio = 'mail.salud.gob.sv';
        
        const operacion = new logueo(sambaApi, zimbraApi);
        operacion.loginZimbra(zimbraCreds.usuario, zimbraCreds.password, dominio)
            .then(function(respuesta){
                req.session.tokenz = respuesta;
                req.session.ts = new Date();
            })
            .catch(function(error){
                console.log(error);
            });
    }

    next();
};

module.exports = { refrescador, token_fuera_tiempo }
