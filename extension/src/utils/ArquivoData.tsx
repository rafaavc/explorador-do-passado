
interface PageMemento {
    noFrame: String,
    timestamp: String
}

interface ArquivoEntity {
    name: String,
    link: String
}

interface ArquivoData {
    memento: Array<PageMemento>,
    entities: Array<ArquivoEntity>
}

export type { ArquivoData }
