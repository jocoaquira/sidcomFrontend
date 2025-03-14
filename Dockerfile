# Utiliza una imagen de Node.js para compilar la aplicación Angular
FROM node:20-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json e instala las dependencias
COPY package.json package-lock.json ./
RUN npm install --force

# Copia el resto del código fuente y construye la aplicación Angular
COPY . .
RUN npm run build --prod

# Utiliza una imagen ligera de Nginx para servir la aplicación
FROM nginx:stable-alpine

# Copia la aplicación Angular construida desde la fase anterior al directorio de Nginx
COPY --from=build /app/dist/sidcom /usr/share/nginx/html

# Copia un archivo de configuración de Nginx optimizado (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expone el puerto 80 para servir la aplicación
EXPOSE 80

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
