import { useEffect, useState } from 'react'
import { Message } from './utils/Message'
import { AppBar, Toolbar, IconButton, Typography, makeStyles, CircularProgress, Box, Container, Chip, Fade } from '@material-ui/core'
import { GitHub } from '@material-ui/icons'
import FaceIcon from '@material-ui/icons/Face'
import BusinessIcon from '@material-ui/icons/Business'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import { logEvent, logReceived } from './utils/Logger'

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

const useStyles = makeStyles(() => ({
        grow: {
            flexGrow: 1,
        }
    }))

const App = () => {
    const [data, setData] = useState<Data|null|number>(null)
    const classes = useStyles()

    useEffect(() => {
        if (process.env.NODE_ENV == "production") {
            const message: Message = { type: "get_ui_data" }
            chrome.runtime.sendMessage(message, (data) => {
                if (data === "invalid_tab") setData(-1)
                else setData(data)

                logEvent("Received data:", data)
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
    }, [])

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
                (typeof data === "number" ?
                    <Box mt={6} mb={6} display="flex" justifyContent="center">
                        Invalid Page
                    </Box>
                    :
                    <Fade in={true}>
                        <Box display="flex" my={2} justifyContent="center" gridGap={5} flexWrap="wrap">
                            {data.entities.map((entity: Identity, idx: number) => {
                                console.log(entity)
                                const icon = entity.type == "PER" ? <FaceIcon /> : (entity.type == "ORG" ? <BusinessIcon/> : <LocationOnIcon/>)
                                return <Chip
                                    key={idx}
                                    icon={icon}
                                    label={entity.text}
                                    clickable
                                    color="primary"
                                />
                            })}
                        </Box>
                    </Fade>)
            }
            </Container>
        </>
    )
}

export default App