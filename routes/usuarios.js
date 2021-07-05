let express = require('express');
let router = express.Router();

const { validationResult } = require('express-validator/check');

const { registroError } = require('justine/lib/utilidades');  

const { permisos } = require('justine/middlewares/seguridad');

const { refrescador } = require('justine/middlewares/refrescador');

const esquemaValidacion = require('justine/lib/usuarios/esquemas/esquemaValidacion');

const instanciarUsuario = require('justine/controladores/usuario');

router.get('/verifica/:id([a-z]+)', permisos('user:retrieve'), refrescador, function(req, res, next){
    let roles = req.session.roles;
    let tokenz = req.session.tokenz;
    
    let sambaApi = req.app.get('sambaApi');
    let zimbraApi = req.app.get('zimbraApi');
    let psqlAcceso = req.app.get('psqlAcceso');
   
    let dominio = req.app.get('sambaDominio'); 
    let username = req.params['id'];
    
    let usuario = instanciarUsuario(roles, sambaApi.acceso, zimbraApi, psqlAcceso, tokenz);
    usuario.verificar(dominio, username)
        .then(function(resultado){
            return res
                .json(resultado); 
        })
        .catch(function(error){
            let respuesta = registroError(req, error);
            return res
                .status((error.status||500))
                .json(respuesta);
        });
});

/* GET usuarios: Detalle General. */
router.get('/detalles', permisos('user:detail'), refrescador, function(req, res, next) {
    let roles = req.session.roles;
    let tokenz = req.session.tokenz;
    
    let sambaApi = req.app.get('sambaApi');
    let zimbraApi = req.app.get('zimbraApi');
    let psqlAcceso = req.app.get('psqlAcceso');

    let dominio = req.app.get('sambaDominio'); 

    let usuario = instanciarUsuario(roles, sambaApi, zimbraApi, psqlAcceso, tokenz);
    usuario.detallar(dominio)
        .then(function(resultado){
            return res
                .json(resultado); 
        })
        .catch(function(error){
            let respuesta = registroError(req, error);
            return res
                .status((error.status||500))
                .json(respuesta);
        });
});

/* 
 * Obtiene a un usuario específico:
 * La mayoría de datos, principalmente de la api para samba (Incluso Whoosh, quizá no para la primera fase)
 * Algunos atributos desde el correo
 * Alguna información desde la base de datos
 * */
router.get('/detalles/:id([a-z]+)', permisos('user:detail'), refrescador, function(req, res, next){
    let roles = req.session.roles;
    let tokenz = req.session.tokenz;
    
    let sambaApi = req.app.get('sambaApi');
    let zimbraApi = req.app.get('zimbraApi');
    let psqlAcceso = req.app.get('psqlAcceso');
   
    let dominio = req.app.get('sambaDominio'); 
    let username = req.params['id'];
    
    let usuario = instanciarUsuario(roles, sambaApi, zimbraApi, psqlAcceso, tokenz);
    usuario.detallar(dominio, username)
        .then(function(resultado){
            return res
                .json(resultado); 
        })
        .catch(function(error){
            let respuesta = registroError(req, error);
            return res
                .status((error.status||500))
                .json(respuesta);
        });
});

/* GET usuarios: Listado General. */
router.get('/', permisos('user:retrieve'), refrescador, function(req, res, next) {
    let roles = req.session.roles;
    let tokenz = req.session.tokenz;
    
    let sambaApi = req.app.get('sambaApi');
    let zimbraApi = req.app.get('zimbraApi');
    let psqlAcceso = req.app.get('psqlAcceso');
   
    let dominio = req.app.get('sambaDominio'); 
    
    let usuario = instanciarUsuario(roles, sambaApi, zimbraApi, psqlAcceso, tokenz);
    usuario.listar(dominio)
        .then(function(resultado){
            return res
                .json(resultado); 
        })
        .catch(function(error){
            let respuesta = registroError(req, error);
            return res
                .status((error.status||500))
                .json(respuesta);
        });
});

/* 
 * Obtiene a un usuario específico:
 * La mayoría de datos, principalmente de la api para samba (Incluso Whoosh, quizá no para la primera fase)
 * Algunos atributos desde el correo
 * Alguna información desde la base de datos
 * */
router.get('/:id([a-z]+)', permisos('user:retrieve'), refrescador, function(req, res, next){
    let roles = req.session.roles;
    let tokenz = req.session.tokenz;
    
    let sambaApi = req.app.get('sambaApi');
    let zimbraApi = req.app.get('zimbraApi');
    let psqlAcceso = req.app.get('psqlAcceso');
   
    let dominio = req.app.get('sambaDominio'); 
    let username = req.params['id'];
    
    let usuario = instanciarUsuario(roles, sambaApi, zimbraApi, psqlAcceso, tokenz);
    usuario.listar(dominio, username)
        .then(function(resultado){
            return res
                .json(resultado); 
        })
        .catch(function(error){
            let respuesta = registroError(req, error);
            return res
                .status((error.status||500))
                .json(respuesta);
        });
});

/* 
 * POST usuarios: Creacion de Usuario. 
 *
 * */
router.post('/', permisos('user:create'), refrescador, esquemaValidacion, function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ errors: errors.array() });
    }
   
    let roles = req.session.roles
    let tokenz = req.session.tokenz;
    
    let sambaApi = req.app.get('sambaApi');
    let zimbraApi = req.app.get('zimbraApi');
    let psqlAcceso = req.app.get('psqlAcceso');

    let dominio = req.app.get('sambaDominio'); 
   
    let usuario = instanciarUsuario(roles, sambaApi, zimbraApi, psqlAcceso, tokenz);
    usuario.crear(dominio, req.body)
        .then(function(creacion){
            return res
                .status(201)
                .location('/usuarios/' + creacion.username)
                .json(creacion); 
        })
        .catch(function(error){
            let respuesta = registroError(req, error);
            console.log(error);
            return res
                .status((error.status||500))
                .json(respuesta);
        });
});

/*
 * PUT usuarios: Actualización de Usuario.
 *
 * */
router.put('/:id([a-z]+)', permisos('user:modify'), refrescador, esquemaValidacion, function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
            .status(400)
            .json({ errors: errors.array() });
    }
    
    let roles = req.session.roles
    let tokenz = req.session.tokenz;
    
    let sambaApi = req.app.get('sambaApi');
    let zimbraApi = req.app.get('zimbraApi');
    let psqlAcceso = req.app.get('psqlAcceso');
    
    let dominio = req.app.get('sambaDominio'); 
    let username = req.params['id'];
    
    let usuario = instanciarUsuario(roles, sambaApi, zimbraApi, psqlAcceso, tokenz);
    usuario.actualizar(dominio, username, req.body)
        .then(function(username){
            return res
                .status(200)
                .json({data: 'Actualizado el usuario ' + username}); 
        })
        .catch(function(error){
            let respuesta = registroError(req, error);
            return res
                .status((error.status||500))
                .json(respuesta);
        });

});

router.delete('/:id([a-z]+)', permisos('user:delete'), refrescador, function(req, res, next){
    let roles = req.session.roles;
    let tokenz = req.session.tokenz; 

    let sambaApi = req.app.get('sambaApi');
    let zimbraApi = req.app.get('zimbraApi');
    let psqlAcceso = req.app.get('psqlAcceso');

    let dominio = req.app.get('sambaDominio'); 
    let username = req.params['id'];

    let usuario = instanciarUsuario(roles, sambaApi, zimbraApi, psqlAcceso, tokenz);
    usuario.borrar(dominio, username)
        .then(function(username){
            return res
                .status(200)
                .json({data: 'Borrado el usuario ' + username}); 
        })
        .catch(function(error){
            let respuesta = registroError(req, error);
            return res
                .status((error.status||500))
                .json(respuesta);
        });

});

module.exports = router;
