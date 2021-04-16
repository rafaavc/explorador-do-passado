
interface PageTimestamp {
    timestamp: string
}

interface PageMemento {
    timestamp: string,
    date: Date
}

interface MementoHistoryEntry {
    url: string, // the original page url
    title: string, // the page title
    favicon?: string, // url of the page favicon
    mementoTimestamp: string, // the memento timestamp
    viewedTimestamp: number
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


export type { ArquivoMemento, ArquivoData, PageMemento, PageTimestamp, ArquivoArticle, ArquivoEntity, MementoHistoryEntry }
