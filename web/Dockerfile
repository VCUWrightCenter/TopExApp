FROM node:lts-alpine as builder
WORKDIR /frontend

COPY . .
RUN echo $(node --version)
RUN echo $(npm --version)
RUN npm install
# CMD ["npm", "start"]
RUN npm run build

FROM nginx:alpine
EXPOSE 80
COPY --from=builder /frontend/build /usr/share/nginx/html
