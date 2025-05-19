# backend/Dockerfile
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto (ajústalo si usas otro)
EXPOSE 8002

# Comando para iniciar el backend
CMD ["node", "index.js"]
