FROM node:lts-alpine as builder
WORKDIR /frontend

COPY . .
RUN echo $(node --version)
RUN echo $(npm --version)
RUN npm install
# CMD ["npm", "start"]
RUN npm run build

# nginx state for serving content
FROM nginx:alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /frontend/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
