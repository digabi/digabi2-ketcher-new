FROM nginx:alpine
COPY example/dist/standalone /usr/share/nginx/html
EXPOSE 80
