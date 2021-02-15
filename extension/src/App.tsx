import { useEffect, useState } from 'react';
import { Message } from './utils/Message';
import { AppBar, Toolbar, IconButton, Typography, makeStyles, CircularProgress, Box, Container, Chip } from '@material-ui/core'
import { GitHub, QuestionAnswer } from '@material-ui/icons'
import FaceIcon from '@material-ui/icons/Face'
import BusinessIcon from '@material-ui/icons/Business';
import ExploreIcon from '@material-ui/icons/Explore';
import HelpIcon from '@material-ui/icons/Help';

interface Identity {
    text: string,
    type: string
}
interface Data {
    title: string,
    authors: Array<string>,
    text: string,
    entities: Array<Identity>
}

const useStyles = makeStyles((theme) => {
    console.log(theme)
    return ({
    grow: {
        flexGrow: 1,
    }
})})

const App = () => {
    const [data, setData] = useState<Data|null>(null)
    const classes = useStyles()

    useEffect(() => {
        if (process.env.NODE_ENV == "production") {
            const message: Message = { type: "get_ui_data" }
            chrome.runtime.sendMessage(message, (data) => {
                setData(data)
            })
        } else {
            setData({
                entities: [
                    {text: "aaa", type: "PER"}
                ],
                title: "test",
                authors: [],
                text: ""
            })
        }
    }, []);

    console.log("Here is the data:", data)

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.grow}>Arquivo.pt</Typography>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <GitHub />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container>
            {data === null ? 
                <Box mt={6} mb={6} display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
                :
                <Box display="flex" my={2} justifyContent="center" gridGap={5} flexWrap="wrap">
                    {data.entities.map((entity: Identity, idx: number) => {
                        const icon = entity.type == "PER" ? <FaceIcon /> : (entity.type == "ORG" ? <BusinessIcon/> : (entity.type == "LOC" ? <ExploreIcon/> : <HelpIcon/>))
                        return <Chip
                            key={idx}
                            icon={icon}
                            label={entity.text}
                            clickable
                            color="primary"
                        />
                    })}
                </Box>
            }
            </Container>
        </>
    );
}

export default App