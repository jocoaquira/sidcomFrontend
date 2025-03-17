# Fase de construcción
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --force
COPY . .
RUN npm run build --configuration=production
RUN ls -la dist/sidcom-v2  

# Fase de despliegue
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/sidcom-v2 .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
