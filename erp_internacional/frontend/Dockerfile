# ---------- Etapa 1: compilar con Vite ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Etapa 2: servir con Nginx (sin root, puerto 8080) ----------
FROM nginxinc/nginx-unprivileged:1.27-alpine
# URL interna del servicio backend dentro de OpenShift (nombre del Service : puerto)
ENV BACKEND_URL=http://backend:8080
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
