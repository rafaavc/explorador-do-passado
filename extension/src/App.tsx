import { useEffect, useState } from 'react';
import { Message } from './utils/Message';
import { AppBar, Toolbar, IconButton, Typography, makeStyles, CircularProgress, Box, Grid, Container } from '@material-ui/core'
import { GitHub } from '@material-ui/icons'

interface Data {
    article: {
        title: string,
        authors: Array<string>,
        text: string
    }
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
        }
    }, []);

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
            {data !== null ? 
                <Box mt={6}>
                    <Grid container justify="center">
                        <Grid item><CircularProgress /></Grid>
                    </Grid>
                </Box>
                :
                <Box my={2}>
                    <Grid container spacing={2} justify="center">
                        <Grid item xs={12}>
                            Test 1
                        </Grid>
                        <Grid item xs={12}>
                            Test 2
                        </Grid>
                    </Grid>
                </Box>
            }
            </Container>
        </>
    );
}

export default App