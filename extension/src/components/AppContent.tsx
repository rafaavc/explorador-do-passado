import { ArquivoData } from '../utils/ArquivoData'
import { EntityList } from './EntityList'
import { MementoList } from './MementoList'

interface AppContentProps {
    data: ArquivoData
}

const AppContent = (props: AppContentProps) => {
    return <>
        {props.data.article ? <EntityList entities={props.data.article.entities} /> : null}
        {props.data.memento ? <MementoList memento={props.data.memento} url={props.data.url} /> : null}
    </>
}


export { AppContent }

