# Build file, taken from
# https://medium.com/@gabimelo/developing-a-flask-api-in-a-docker-container-with-uwsgi-and-nginx-e089e43ed90e
FROM node:14.1 AS js_setup

COPY . /byo-book

WORKDIR /byo-book/frontend

RUN npm install
RUN npm run build

# We've built our frontend, we don't need the dev dependencies.
RUN rm -rf /byo-book/frontend/node_modules

FROM python:3.8

WORKDIR /

COPY . /

COPY --from=js_setup /byo-book /

RUN ln -s /frontend/build/static /byob/static 
RUN ln -s /frontend/build /byob/templates

RUN apt-get update
RUN apt-get install -y --no-install-recommends \
    libatlas-base-dev gfortran nginx supervisor

RUN pip3 install uwsgi

RUN pip3 install -r requirements.txt

RUN useradd --no-create-home nginx

RUN rm /etc/nginx/sites-enabled/default
RUN rm -r /root/.cache

COPY /config/nginx.conf /etc/nginx
COPY /config/flask-site-nginx.conf /etc/nginx/conf.d/
COPY /config/uwsgi.ini /etc/uwsgi/
COPY /config/supervisord.conf /etc/

WORKDIR /

ENTRYPOINT ["/usr/bin/supervisord"]
