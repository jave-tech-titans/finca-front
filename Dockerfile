FROM node:18.19.1 AS builder

WORKDIR /app
COPY ./ /app

RUN npm install --legacy-peer-deps \
    && npm install -g @angular/cli \
    && ng build --configuration=production \
    && mv dist/finca_front/browser/index.csr.html dist/finca_front/browser/index.html 

FROM httpd:2.4

COPY ./k8s/my-httpd.conf /usr/local/apache2/conf/httpd.conf 
COPY ./k8s/.htaccess /usr/local/apache2/htdocs/ 

RUN rm -f /usr/local/apache2/htdocs/index.html
COPY --from=builder /app/dist/finca_front/browser /usr/local/apache2/htdocs/

EXPOSE 80
CMD ["httpd", "-D", "FOREGROUND"]
