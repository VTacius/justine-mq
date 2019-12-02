let express = require('express');
let router = express.Router();

const logueo = require('justine/controladores/login');

router.post('/logout', function(req, res){
    let mensaje = "No hay sesión que terminar"; 
    if (req.session.roles){
        req.session.destroy(function(error){
            if(error){
                return res
                    .json({'mensaje': 'Error al terminar la sessión'});
                
            }
        });
        mensaje = "Terminada la sesión";
    } 
    return res
        .json({mensaje});
});

router.post('/login', function(req, res){
    if (req.session.roles){

        let roles = req.session.roles; 
        let displayName = req.session.displayName;

        /* Enviamos un par de datos importantes, es posible que el cliente los haya olvidado */
        let mensaje = {roles, displayName}
        return res
            .json(mensaje);
    } else {
        let usuario = req.body.username; 
        let password = req.body.password;
        let zimbraCreds = req.app.get('zimbraCreds');
        let dominio = 'mail.salud.gob.sv';
        
        let sambaApi = req.app.get('sambaApi');
        let zimbraApi = req.app.get('zimbraApi');
        
        const operacion = new logueo(sambaApi, zimbraApi);
        operacion.login(zimbraCreds, usuario, password, dominio)
            .then(function(respuesta){
                /* Configuramos un par de cosas para la sessión */
                req.session.displayName = respuesta.displayName;
                req.session.username = respuesta.usuario;
                req.session.roles = respuesta.roles;
                req.session.tokenz = respuesta.tokenz;
                req.session.ts = new Date();
                
                let mensaje = {roles: req.session.roles, displayName: req.session.displayName, tokenz: req.session.tokenz}
                return res
                    .status(201)
                    .json(mensaje);
            })
            .catch(function(error){
                return res
                   .status(401)
                   .json({'mensaje': 'No autenticado'});
            });
    };
    
});

module.exports = router;
