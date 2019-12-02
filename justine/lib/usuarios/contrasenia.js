const creadorContrasenia = function(usuario){
    let password;
    
    /* TODO: Acá se implementa un ligero algoritmo para crear una contraseña por defecto */
    password = 'Z' + usuario.slice(0, 3) +  '_123'; 

    return password;
};

module.exports = creadorContrasenia;
