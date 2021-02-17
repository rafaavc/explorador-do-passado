from flask import Flask, request
from process import inFlightWebsiteProcess
import spacy

app = Flask(__name__)
nlp = spacy.load("pt_core_news_md")

@app.route('/')
def home():
    return "Hello stranger:)"

@app.route('/extension/api', methods=['POST'])
def extensionApi():
    url = request.json['url']
    html = request.json['html']

    return inFlightWebsiteProcess(url, nlp, html)
