import sys, json, spacy
from process import inFlightWebsiteProcess

if (len(sys.argv) != 2): raise Exception("This script receives exactly one argument, the url of the article.")

url = sys.argv[1]
nlp = spacy.load("pt_core_news_md")

data = inFlightWebsiteProcess(url, nlp)

with open('../extension/src/dev_data.json', 'w') as f:
    json.dump(data, f)
