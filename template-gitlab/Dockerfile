FROM node:16.13-alpine as build

WORKDIR /frontend-app
COPY package.json package-lock.json ./
RUN npm install --registry=https://registry.npm.taobao.org
COPY . .
RUN npm run build

FROM nginx:1.21.4
COPY --from=build /frontend-app/dist /usr/share/nginx/html
WORKDIR /usr/local/nginx
COPY nginx.conf /etc/nginx/conf.d
ENTRYPOINT ["nginx"]
CMD ["-g","daemon off;"]