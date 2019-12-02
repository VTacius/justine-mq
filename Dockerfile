FROM node:alpine

ARG ID

# El espacio de trabajo, el espacio
RUN mkdir /var/www
VOLUME /var/www

# Instalación de los paquetes 
RUN npm install express-generator nodemon -g

# Configuración del funcionamiento
EXPOSE 3000
WORKDIR /var/www

RUN adduser -D -u ${ID:-1001} usuario

USER usuario
CMD ["nodemon"]
