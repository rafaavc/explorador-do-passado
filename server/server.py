from flask import Flask, request
from newspaper import Article
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

    a = Article(url)
    a.set_html(html)

    a.parse()

    content = a.title + "\n" + a.text
    doc = nlp(content)

    entities = list()
    for entity in doc.ents:
        if entity.label_ != "PER" and entity.label_ != "LOC" and entity.label_ != "ORG": continue

        text = entity.text

        alreadyExists = False
        for d in entities:
            if d['text'] == text:
                alreadyExists = True
                break
        if alreadyExists: continue

        entities.append({ 'text': text, 'type': entity.label_ })

    return {
        'title': a.title,
        'authors': a.authors,
        'publish_date': a.publish_date,
        'text': a.text,
        'top_image': a.top_image,
        'entities': entities
    }


    




