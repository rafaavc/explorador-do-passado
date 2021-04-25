from newspaper import Article

def getBasicArticleInfo(url, html=None):
    a = Article(url)

    if (html == None): a.download()
    else: a.set_html(html)

    a.parse()

    return {
        'title': a.title,
        'authors': a.authors,
        #'publish_date': a.publish_date.str,
        'text': a.text,
        'top_image': a.top_image,
    }
