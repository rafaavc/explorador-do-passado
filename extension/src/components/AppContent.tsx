import { Box, Typography, CardContent, Card, makeStyles, Divider } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { selectPageState } from '../store/dataSlice'
import { selectDefaultEntitiesState } from '../store/settingsSlice'
import { ArquivoData } from '../utils/ArquivoData'
import { PageState, PageStateId } from '../utils/Page'
import { EntityList } from './EntityList'
import { MementoList } from './MementoList'
import { MementoViewingCard } from './MementoViewingCard'

interface AppContentProps {
    data: ArquivoData,
    customComponent?: JSX.Element
}

const useStyles = makeStyles((theme) => {
    return {
        card: {
            marginTop: theme.spacing(3)
        }
    }
});

const AppContent = (props: AppContentProps) => {
    const url = new URL(props.data.url);
    const state: PageState = useSelector(selectPageState);
    const defaultEntitiesState = useSelector(selectDefaultEntitiesState);
    const classes = useStyles();

    return <>
        <Card elevation={3} className={classes.card}>
            <CardContent>
                <Box>
                    <Typography variant="subtitle1">{props.data.article.title}</Typography>
                    <Typography variant="caption">{url.hostname}</Typography>
                </Box>
            </CardContent>
            { state.id != PageStateId.START ? <><Divider/><MementoViewingCard timestamp={state.data} /></> : null }
            <Divider/>
            {/* <EntityList entities={props.data.article.entities} open={state.id == PageStateId.START && defaultEntitiesState} /> */}
        </Card>
        <MementoList memento={props.data.memento} url={props.data.url} />
    </>
}


export { AppContent }

