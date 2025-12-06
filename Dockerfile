# === Build stage ===
FROM node:22-alpine AS build
WORKDIR /app

# Accept API_URL as build argument
ARG API_URL
# Persist it for the build steps
ENV API_URL=${API_URL}

COPY package*.json ./
RUN npm ci
COPY . .

# Debug: Print the API_URL to build logs to verify it's present
RUN echo "Building with API_URL=${API_URL}"

# Replace API_URL placeholder in environment file.
# We use a different delimiter (#) to avoid issues if the URL contains slashes
RUN sed -i "s#\${API_URL}#${API_URL}#g" src/environments/environment.prod.ts

# Debug: Cat the file to verify replacement worked
RUN cat src/environments/environment.prod.ts

RUN npm run build --prod

# === Runtime stage ===
FROM nginx:alpine
# Copy built Angular app
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
# Copy nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
