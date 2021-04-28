#!/bin/sh

nginx & gunicorn -w 3 arquivohserver:app