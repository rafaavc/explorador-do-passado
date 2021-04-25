import { Link, DialogContentText, DialogContent, AppBar, Toolbar, Typography, Tooltip, IconButton, makeStyles, Dialog, Button, DialogTitle, DialogActions } from '@material-ui/core'
import LanguageIcon from '@material-ui/icons/Language'
import TuneIcon from '@material-ui/icons/Tune'
import InfoIcon from '@material-ui/icons/Info';
import { useState } from 'react'
import { SettingsDialog } from './Settings'
import { openURL } from '../utils/URL'
import HistoryIcon from '@material-ui/icons/History'
import { HistoryDialog } from './History';
import { useSelector } from 'react-redux';
import { selectLanguageText } from '../store/settingsSlice';

const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
        cursor: 'pointer',
        userSelect: 'none'
    }
}))

interface InfoDialogProps {
    open: boolean,
    onCloseFn: any
}

const InfoDialog = (props: InfoDialogProps) => {
    const { open, onCloseFn } = props;

    const contentText = useSelector(selectLanguageText);
  
    return <Dialog onClose={onCloseFn} aria-labelledby="info-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{contentText.info.titleBeginning + contentText.extensionTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {contentText.info.content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={openURL.bind(undefined, contentText.info.arquivoURL)} color="primary">
                    {contentText.info.arquivoButtonText}
                </Button>
                <Button onClick={onCloseFn} color="primary" autoFocus>
                    {contentText.general.closeButtonText}
                </Button>
            </DialogActions>
        </Dialog>
}

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
                    <IconButton edge="start" color="inherit" onClick={openURL.bind(undefined, 'https://rafaelcristino.com/arquivo-handbook')} aria-label="menu">
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
