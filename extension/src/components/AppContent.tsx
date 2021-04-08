import { Box, Typography } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { selectPageState } from '../store/dataSlice'
import { ArquivoData } from '../utils/ArquivoData'
import { PageState, PageStateId } from '../utils/Page'
import { EntityList } from './EntityList'
import { MementoList } from './MementoList'

interface AppContentProps {
    data: ArquivoData,
    customComponent?: JSX.Element
}

const AppContent = (props: AppContentProps) => {
    const url = new URL(props.data.url);
    const state: PageState = useSelector(selectPageState);
    return <>
        <Box mt={1.5} mb={3}>
            <Typography variant="subtitle1">{props.data.article.title}</Typography>
            <Typography variant="caption">{url.hostname}</Typography>
        </Box>
        { props.customComponent ? props.customComponent : <EntityList entities={props.data.article.entities} /> }
        <MementoList memento={props.data.memento} url={props.data.url} />
    </>
}


export { AppContent }

