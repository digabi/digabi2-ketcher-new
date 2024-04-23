# TODO: Update to a later version of node
## However, this requires updating ttypescript (not typescript!) to 1.5.15, 
## which for some reason breaks everything, so it might be smartest to wait for an upstream update
## from Ketcher.
FROM node:16.20.1 as build

WORKDIR /app

COPY . ./

RUN npm install
RUN npm run build
RUN find example/dist/standalone -name "*" | xargs grep -sl "window.top" | xargs --no-run-if-empty sed -i 's/window.top/window/g'

FROM nginx:alpine
COPY --from=build /app/example/dist/standalone /usr/share/nginx/html
EXPOSE 80
