import { AppBar, Toolbar, Typography, Tooltip, IconButton, makeStyles, Dialog, Button, DialogTitle, DialogActions } from '@material-ui/core'
import { useState } from 'react'
import { SettingsDialog } from './Settings'
import { openURL } from '../utils/URL'
import { HistoryDialog } from './History'
import { useSelector } from 'react-redux'
import { selectLanguageText } from '../store/settingsSlice'
import { InfoDialog } from './InfoDialog'
import LanguageIcon from '@material-ui/icons/Language'
import TuneIcon from '@material-ui/icons/Tune'
import InfoIcon from '@material-ui/icons/Info'
import HistoryIcon from '@material-ui/icons/History'

const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
        cursor: 'pointer',
        userSelect: 'none'
    }
}))

const Header = () => {
    const classes = useStyles();

    const [ infoOpen, setInfoOpen ] = useState(false);
    const [ settingsOpen, setSettingsOpen ] = useState(false);
    const [ historyOpen, setHistoryOpen ] = useState(false);

    const contentText = useSelector(selectLanguageText);

    return <>
        <AppBar position="static" elevation={6}>
            <Toolbar>
                <Typography onClick={
                    () => { 
                        const contentWrapper = document.querySelector('#ah-content-wrapper');
                        if (contentWrapper == undefined) return;
                        contentWrapper.scrollBy(0, - contentWrapper.scrollTop);
                    }
                } variant="h6" className={classes.grow}>{contentText.extensionTitle}</Typography>
                <Tooltip title={contentText.website.tooltip}>
                    <IconButton edge="start" color="inherit" onClick={openURL.bind(undefined, 'https://rafaelcristino.com/explorador-do-passado')} aria-label="menu">
                        <LanguageIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={contentText.info.tooltip}>
                    <IconButton edge="start" color="inherit" onClick={() => setInfoOpen(true)} aria-label="menu">
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={contentText.history.tooltip} onClick={setHistoryOpen.bind(undefined, true)}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <HistoryIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title={contentText.settings.tooltip}>
                    <IconButton edge="start" color="inherit" onClick={() => setSettingsOpen(true)} aria-label="menu">
                        <TuneIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
        <InfoDialog open={infoOpen} onCloseFn={() => setInfoOpen(false)} />
        <SettingsDialog open={settingsOpen} onCloseFn={() => setSettingsOpen(false)} />
        <HistoryDialog open={historyOpen} onCloseFn={() => setHistoryOpen(false)} />
    </>

}


export { Header }
