FROM alpine:latest

WORKDIR /home/

RUN apk add python3-dev libxml2-dev libxslt-dev gcc jpeg-dev zlib-dev musl-dev
RUN python3 -m ensurepip

RUN pip3 install wheel gunicorn flask newspaper3k

COPY ./dist/arquivohserver-1.0.0-py3-none-any.whl .
RUN pip3 install arquivohserver-1.0.0-py3-none-any.whl

RUN apk add nginx
RUN adduser -D -g 'www' www && mkdir /www && chown -R www:www /var/lib/nginx && chown -R www:www /www

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./run.sh /home/

EXPOSE 80/tcp

CMD ["./run.sh"]
