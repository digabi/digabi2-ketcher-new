FROM node:18.17.0-bullseye as build

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

WORKDIR /app

COPY . ./

RUN npm install
RUN pwd
RUN ls -la
RUN git log --oneline -n 5
RUN npm run build
RUN find example/dist/standalone -name "*" | xargs grep -sl "window.top" | xargs --no-run-if-empty sed -i 's/window.top/window/g'

FROM nginx:alpine
COPY --from=build /app/example/dist/standalone /usr/share/nginx/html
EXPOSE 80
