import requests


def makeSearch(site, query):
    params = {
        'type': 'html',
        'siteSearch': site,
        'fields': 'title, originalURL, tstamp, linkToScreenshot, linkToNoFrame, collection, snippet',
        'q': query
    }
    res = makeRequest(params)
    print(res)
    return res['response_items']

def makeRequest(payload, url="https://arquivo.pt/textsearch", json=True):
    req = requests.get(url, payload)
    if json: return req.json()
    return req.text
    

