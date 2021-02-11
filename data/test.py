from arquivo import makeSearch
from newspaper import Article
import text2emotion as te
from google_trans_new import google_translator

translator = google_translator()

news = makeSearch("publico.pt", "obama")
for article in news:
    print(article['title'])
    a = Article(article['linkToNoFrame'])
    a.download()
    a.parse()
    en = translator.translate(a.text, lang_tgt='en', lang_src='pt')
    #print(en)
    print(te.get_emotion(en))