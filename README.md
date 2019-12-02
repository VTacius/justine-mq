## Montando una infraestructura para desarrollo

### Creamos un par de usuarios que nos servirán para todas las peticiones
``` sh
samba-tool user create administrador
samba-tool user create tecnico
samba-tool user create usuario
```

### Los ponemos en los grupos respectivos: Esta configuración debe coincidir con la que se encuentra en el fichero configuracion.js
``` sh
samba-tool group addmembers Administrators administrador
samba-tool group addmembers DnsAdmins tecnico
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

