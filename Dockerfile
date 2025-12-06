# === Build stage ===
FROM node:22-alpine AS build
WORKDIR /app

# Accept API_URL as build argument
ARG API_URL
ENV API_URL=${API_URL}

COPY package*.json ./
RUN npm ci
COPY . .

# Replace API_URL placeholder in environment file
RUN sed -i "s|\${API_URL}|${API_URL}|g" src/environments/environment.prod.ts

RUN npm run build --prod

# === Runtime stage ===
FROM nginx:alpine
# Copy built Angular app
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
