class Auth {
    constructor () {
        this.payload;
        this.datos;
    }
   
    obtenerRol(usuario){
        return 'administrador';
    }

    verificarCredenciales(usuario, password){
        return usuario === password;
    }

    obtenerGecos(usuario){
        return "Francisco Alexander Rodríguez Ortíz";
    }

    autenticar (usuario, password)  {
        let ac = this.verificarCredenciales(usuario, password);
        if (ac){
            let rol = this.obtenerRol(usuario);
            let gecos = this.obtenerGecos(usuario);
            this.payload = {usuario, rol};
            this.datos = {gecos, rol};
            return true;
        } else {
            return false;
        }
    }

    
}

module.exports = new Auth();