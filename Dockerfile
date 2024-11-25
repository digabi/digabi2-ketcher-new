FROM node:18.17.0-bullseye as build

WORKDIR /app

COPY . ./

RUN npm install
RUN npm run build
RUN find example/dist/standalone -name "*" | xargs grep -sl "window.top" | xargs --no-run-if-empty sed -i 's/window.top/window/g'

FROM nginx:alpine
COPY --from=build /app/example/dist/standalone /usr/share/nginx/html
EXPOSE 80
