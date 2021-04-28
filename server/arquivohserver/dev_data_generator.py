import sys, json, requests, math
from arquivohserver.process import getBasicArticleInfo

if (len(sys.argv) != 2): raise Exception("This script receives exactly one argument, the url of the article.")

url = sys.argv[1]

data = dict()
data['article'] = getBasicArticleInfo(url)
data['url'] = url

res = requests.get('http://arquivo.pt/wayback/cdx?url=%s&output=json&fl=timestamp' % url).text

res = res.split('\n')
del res[len(res) - 1]

res = ", ".join(res)
res = '{ "data": [%s] }' % res
res = json.loads(res)

years = []
pageMementos = []

for memento in res['data']:
    timestamp = memento['timestamp']
    pageMementos.append({ 'timestamp': timestamp })
    years.append(math.floor(float(timestamp) / math.pow(10, 10)))


data['memento'] = {
    'list': pageMementos,
    'years': years
}


with open('../extension/src/dev_data.json', 'w') as f:
    json.dump(data, f)
