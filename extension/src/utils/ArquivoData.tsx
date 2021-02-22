
interface PageMemento {
    timestamp: string
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

interface ArquivoData {
    memento?: Array<PageMemento>,
    article?: ArquivoArticle,
    url: string
}


export type { ArquivoData, PageMemento, ArquivoArticle, ArquivoEntity }
