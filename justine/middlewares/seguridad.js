let recursoPropio = function(user, datos, parametros){
    return user.username === parametros.id;
}

const roles = {
    usuario: {
        can: [{name: 'user:retrieve'}, {name: 'user:detail', when: recursoPropio}, {name: 'user:modify', when: recursoPropio}]
    },
    tecnico: {
        can: [{name: 'user:retrieve'}, {name: 'user:detail'}, {name: 'user:modify', when: recursoPropio}]
    },
    administrador: {
        can: [{name: 'user:create'}, {name: 'user:retrieve'}, {name: 'user:detail'}, {name: 'user:modify'}, {name: 'user:delete'}]
    }
}

let verificarPermisos = function(user, datos, parametros, operacion){
    let resultado = user.roles.find(function(rol){
        if (rol in roles){
            
            let restriccion = roles[rol].can.find(function(r){
                return r.name === operacion;  
            });
            
            if (restriccion && typeof restriccion.when === 'function'){
                return restriccion.when(user, datos, parametros);
            } else {
                return restriccion;
            }
        } 
    }, this);
    return resultado;
}

let permisos = function(operacion){
    return function(req, res, next){
        let roles = req.session.roles; 
        if (Array.isArray(roles) && roles.length > 0){
            let username = req.session.username; 
            let user = {roles, username}
            
            let esPermitido = verificarPermisos(user, req.body, req.params, operacion);
            
            if (esPermitido){
                next();
            } else {
                return res
                    .status(403)
                    .json({'mensaje': 'Permisos unsuficientes'})
            }
        } else {
            return res
                .status(401)
                .json({'mensaje': 'Debe autenticarse'})
        
        }
    }
}

module.exports = { permisos } ;
