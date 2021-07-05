## Montando una infraestructura para desarrollo

## Preparando el entorno de desarrollo

### Zimbra
Creamos un usuario y lo configuramos como administrador. Las credenciales tienen que coincidir con las especificadas en el fichero configuracion.js
``` bash
zmprov ca api.gzovbbbqznqm@sanidad.gob.sv P.4ssw0rd
zmprov ma api.gzovbbbqznqm@sanidad.gob.sv zimbraIsAdminAccount TRUE
```

### Samba

Creamos un par de usuarios que nos servirá en las pruebas funcionales
 
``` bash
samba-tool user create administrador
samba-tool user create tecnico
samba-tool user create usuario
```

Los ponemos en los grupos respectivos: Esta configuración debe coincidir con la que se encuentra en el fichero configuracion.js

``` bash
samba-tool group addmembers Administrators administrador
samba-tool group addmembers DnsAdmins tecnico
```

### Sesión
Iniciamos sesión en la aplicación y la guardamos
``` bash
curl -sL -H 'Content-Type: application/json' -XPOST 127.0.0.1:3000/auth/login -d '{"username": "administrador", "password": "P@ssw0rd.123"}' --cookie-jar galleta
```

## Operaciones para endpoint usuarios
+ Listamos los usuarios disponibles en el sistema
``` bash
curl -sL -H 'Content-Type: application/json' -XGET 127.0.0.1:3000/usuarios --cookie galleta
curl -sL -H 'Content-Type: application/json' -XGET 127.0.0.1:3000/usuarios/detalles --cookie galleta 
```

+ Creación de usuario
``` bash
curl -sL -H 'Content-Type: application/json' --cookie galleta -XPOST 127.0.0.1:3000/usuarios -d @textures/usuario.json
```

+ Obtenemos al usuario recién creado
``` bash
curl -sL -H 'Content-Type: application/json' -XGET 127.0.0.1:3000/usuarios/opineda --cookie galleta | jq
curl -sL -H 'Content-Type: application/json' -XGET 127.0.0.1:3000/usuarios/detalles/opineda --cookie galleta | jq
```

+ Modificamos dicho usuario
``` bash
curl -sL -H 'Content-Type: application/json' --cookie galleta -XPUT 127.0.0.1:3000/usuarios/opineda -d @textures/usuario_modificacion.json
```

### Infraestructura con docker
Se crean las imágenes:
```sh
docker build . -t nomaqueta
```

Iniciamos redis con poco más que las opciones por defecto
```sh
docker run --rm --hostname redis --name redis -p 6379:6379 redis:alpine
```

Iniciamos postgres con poco más que las opciones por defecto.
Especificás la versión porque una vez inicializada con una no podés usar la versión superior si antes migrar la base
```sh
docker run -it --rm  --hostname postgres --name postgres -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=password postgres:10-alpine
```

Se abren un par de nodos
```sh
docker run --rm -it -v $(pwd):/var/www:Z -p 3000:3000 --link redis --link postgres nomaqueta
```

### Test automatizados
```sh
docker run --rm -it -v $(pwd):/var/www:Z -p 3000:3000 --link redis --link postgres nomaqueta npm test
```

