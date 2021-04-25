from flask import Flask, request
from arquivohserver.process import getBasicArticleInfo

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello stranger :)"

@app.route('/extension/api/page', methods=['POST'])
def extensionApiPage():
    url = request.json['url']
    html = request.json['html']

    # TODO check if html is present or not

    return getBasicArticleInfo(url, html)

