# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Build args for environment configuration
ARG VITE_API_URL=""
ARG VITE_GITHUB_CLIENT_ID=""

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GITHUB_CLIENT_ID=$VITE_GITHUB_CLIENT_ID

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
