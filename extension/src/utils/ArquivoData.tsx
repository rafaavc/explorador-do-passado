
interface PageTimestamp {
    timestamp: string
}

interface PageMemento {
    timestamp: string,
    date: Date
}

interface ArquivoEntity {
    text: string,
    type: string
}

interface ArquivoArticle {
    title: string,
    authors: Array<string>,
    text: string,
    top_image: string,
    entities: Array<ArquivoEntity>
}

interface ArquivoMemento<T=PageMemento> {
    list: Array<T>,
    years: Array<number>
}

interface ArquivoData<T=PageMemento> {
    memento: ArquivoMemento<T>,
    article: ArquivoArticle,
    url: string
}


export type { ArquivoMemento, ArquivoData, PageMemento, PageTimestamp, ArquivoArticle, ArquivoEntity }
