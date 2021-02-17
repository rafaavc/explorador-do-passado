from newspaper import Article

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

    return {
        'title': a.title,
        'authors': a.authors,
        #'publish_date': a.publish_date.str,
        'text': a.text,
        'top_image': a.top_image,
        'entities': entities
    }
