from flask import Flask, request
from newspaper import Article

app = Flask(__name__)

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

    return {
        'article': {
            'title': a.title,
            'authors': a.authors,
            'publish_date': a.publish_date,
            'text': a.text,
            'top_image': a.top_image,
            'keywords': a.keywords
        }
    }


    




