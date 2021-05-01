import { Box, Typography, CardContent, Card, makeStyles, Divider } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { selectArquivoData, selectPageState } from '../store/dataSlice'
import { ArquivoData } from '../utils/ArquivoData'
import { PageState, PageStateId } from '../utils/Page'
import { getFaviconURL } from '../utils/URL'
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
        },
        favicon: {
            display: 'inline-block',
            marginRight: '.5rem'
        },
        title: {
            display: 'inline'
        }
    }
});

const AppContent = (props: AppContentProps) => {
    const url = new URL(props.data.url);
    const state: PageState = useSelector(selectPageState);
    const arquivoData = useSelector(selectArquivoData);
    const classes = useStyles();

    return <>
        <Card elevation={3} className={classes.card}>
            <CardContent>
                <Box>
                    <img src={getFaviconURL(arquivoData?.url)} className={classes.favicon} />
                    <Typography variant="subtitle1" className={classes.title}>{props.data.article.title}</Typography>
                    <br/>
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

