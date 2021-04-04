from flask import Flask, request
from process import inFlightWebsiteProcess, getBasicArticleInfo
import spacy

app = Flask(__name__)
nlp = spacy.load("pt_core_news_md")

@app.route('/')
def home():
    return "Hello stranger :)"

@app.route('/extension/api/page', methods=['POST'])
def extensionApiPage():
    url = request.json['url']
    html = request.json['html']

    return inFlightWebsiteProcess(url, nlp, html)


@app.route('/extension/api/diff/page', methods=['POST'])
def extensionApiDiff():
    url = request.json['url']
    print("Received: " + url)
    return getBasicArticleInfo(url)
