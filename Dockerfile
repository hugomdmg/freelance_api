# Usar una imagen base de Node.js LTS
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /API

# Copiar archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --omit=dev

# Copiar el resto del código al contenedor
COPY . .

# Exponer el puerto en el que la API escuchará
EXPOSE 3001

# Comando para iniciar el backend
CMD ["node", "index.js"]
