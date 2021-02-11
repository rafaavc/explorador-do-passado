from datetime import datetime, timedelta
import requests
import json
from progress.bar import Bar
import math
from pymongo import MongoClient
from newspaper import Article, ArticleException
import time

db = MongoClient()['arquivoMVP']
articlesCollection = db['articles']

class CustomBar(Bar):
    suffix = '%(percent)d%%, %(pagesRcvd)d pages received'
    pagesRcvd = 0
    
    def incrementPagesRcvd(self, n):
        self.pagesRcvd += n

domain = json.load(open('config.json', 'r'))['domain']


def makeSearch(site, query, fromTime=1996, toTime=2021):
    params = {
        'type': 'html',
        'siteSearch': site,
        'fields': 'title, originalURL, tstamp, linkToScreenshot, linkToNoFrame, collection, snippet',
        'q': query,
        'maxItems': 2000,
        'from': fromTime,
        'to': toTime
    }
    while True:
        try:
            res = makeRequest(params)
            return res['response_items']
        except Exception as ex:
            print("\n!! Received status code", ex.args[0])
            code = ex.args[0]
            if code == 429: # too many requests
                time.sleep(10)
            else: return []


def makeRequest(payload, url="https://arquivo.pt/textsearch", json=True):
    req = requests.get(url, payload)

    if req.status_code != 200:
        raise Exception(req.status_code)

    if json: return req.json()
    return req.text


def arquivoTimeToDatetime(datetimeString):
    return datetime.strptime(datetimeString,"%Y%m%d%H%M%S")

def datetimeToArquivoTime(datetimeObj):
    return datetimeObj.strftime("%Y%m%d%H%M%S")

def indexData():
    currentStart = arquivoTimeToDatetime(domain['time']['start'])
    end = arquivoTimeToDatetime(domain['time']['end'])

    delta = timedelta(days=7)

    maxIter = math.ceil((end - currentStart) / delta)

    bar = CustomBar('Getting data...', max=maxIter)

    while True:
        currentEnd = currentStart + delta
        if currentEnd > end: currentEnd = end

        itemsReceived = makeSearch(domain['journals'][0], "", datetimeToArquivoTime(currentStart), datetimeToArquivoTime(currentEnd))
        bar.incrementPagesRcvd(len(itemsReceived))

        bar.next()

        for page in itemsReceived:
            req = requests.get(page['linkToNoFrame'])
            if req.status_code != 200: continue

            a = Article(page['linkToNoFrame'])
            a.set_html(req.text)
            try:
                a.parse()
            except ArticleException: 
                print('ArticleException: downloading from', page['linkToNoFrame'])

            articlesCollection.insert_one({
                'linkToNoFrame': page['linkToNoFrame'],
                'title': a.title,
                'authors': a.authors,
                'publish_date': a.publish_date,
                'text': a.text,
                'top_image': a.top_image,
                'keywords': a.keywords
            })

        if currentEnd == end: break
        currentStart = currentEnd


if __name__ == "__main__":
    indexData()
    print()


