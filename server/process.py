from newspaper import Article

def getTypeScore(type):
    if type == "PER": return 0
    elif type == "ORG": return 1
    elif type == "LOC": return 2
    else: return 3

def inFlightWebsiteProcess(url, nlp, html=None):
    a = Article(url)

    if (html == None): a.download()
    else: a.set_html(html)

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

    entities.sort(key=lambda entity : getTypeScore(entity['type']))

    return {
        'title': a.title,
        'authors': a.authors,
        #'publish_date': a.publish_date.str,
        'text': a.text,
        'top_image': a.top_image,
        'entities': entities
    }


def getBasicArticleInfo(url):
    a = Article(url)

    a.download()
    a.parse()

    return {
        'title': a.title,
        'authors': a.authors,
        #'publish_date': a.publish_date.str,
        'text': a.text,
        'top_image': a.top_image,
    }
