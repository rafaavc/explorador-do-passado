import { AppBar, Toolbar, Typography, Tooltip, IconButton, makeStyles } from '@material-ui/core'
import { GitHub } from '@material-ui/icons'

const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
    }
}))

const Header = () => {
    const classes = useStyles()

    return <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" className={classes.grow}>Arquivo.pt</Typography>
            <Tooltip title="GitHub Repository">
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <GitHub />
                </IconButton>
            </Tooltip>
        </Toolbar>
    </AppBar>
}


export { Header }
