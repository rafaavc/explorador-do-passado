import sys, json, spacy, requests
from process import inFlightWebsiteProcess

if (len(sys.argv) != 2): raise Exception("This script receives exactly one argument, the url of the article.")

url = sys.argv[1]
nlp = spacy.load("pt_core_news_md")

data = dict()
data['article'] = inFlightWebsiteProcess(url, nlp)
data['url'] = url

res = requests.get('http://arquivo.pt/wayback/cdx?url=%s&output=json&fl=timestamp' % url).text

res = res.split('\n')
del res[len(res) - 1]

res = ", ".join(res)
res = '{ "data": [%s] }' % res
res = json.loads(res)

data['memento'] = res['data']


with open('../extension/src/dev_data.json', 'w') as f:
    json.dump(data, f)
