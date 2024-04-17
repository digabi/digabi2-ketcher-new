FROM nginx:alpine
COPY standalone /usr/share/nginx/html
EXPOSE 80
