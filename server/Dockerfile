FROM alpine:latest

WORKDIR /home/

RUN apk add python3-dev libxml2-dev libxslt-dev gcc jpeg-dev zlib-dev musl-dev
RUN python3 -m ensurepip

RUN pip3 install wheel
RUN pip3 install gunicorn

COPY ./dist/arquivohserver-1.0.0-py3-none-any.whl .
RUN pip3 install arquivohserver-1.0.0-py3-none-any.whl

EXPOSE 8000/tcp

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "arquivohserver:app"]


