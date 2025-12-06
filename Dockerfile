# === Build stage ===
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build --prod

# === Runtime stage ===
FROM nginx:alpine

# Install envsubst (part of gettext)
RUN apk add --no-cache gettext

# Copy built Angular app
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY entrypoint.sh /docker-entrypoint.d/40-env-subst.sh
RUN chmod +x /docker-entrypoint.d/40-env-subst.sh

# By default, the official nginx image runs scripts in /docker-entrypoint.d/
# before starting nginx. We can just use the default CMD.
EXPOSE 80
