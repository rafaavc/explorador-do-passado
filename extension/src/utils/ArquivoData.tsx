
interface PageMemento {
    timestamp: Date
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

interface ArquivoMemento {
    list: Array<PageMemento>,
    years: Array<number>
}

interface ArquivoData {
    memento?: ArquivoMemento,
    article?: ArquivoArticle,
    url: string
}


export type { ArquivoMemento, ArquivoData, PageMemento, ArquivoArticle, ArquivoEntity }
