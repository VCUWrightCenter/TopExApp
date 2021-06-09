FROM node:alpine as builder
WORKDIR /frontend
COPY package.json ./
RUN npm install
COPY . .
# CMD ["npm", "start"]
RUN npm run build

FROM nginx 
EXPOSE 80
COPY --from=builder /frontend/build /usr/share/nginx/html