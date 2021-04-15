import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, DialogContent, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Switch, makeStyles, CardContent, Divider } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React, { useState } from 'react'
import { TransitionProps } from '@material-ui/core/transitions'
import contentText from '../text/en.json'
import { useSelector } from 'react-redux'
import { selectHistory, selectHistoryStatus } from '../store/historySlice'
import { MementoHistoryEntry, PageMemento } from '../utils/ArquivoData'
import { arquivoDateToDate, getHumanReadableDate } from '../utils/ArquivoDate'
import * as timeago from 'timeago.js'
import { MementoEntryActions } from './MementoEntryActions'
import { selectArquivoData } from '../store/dataSlice'

interface HistoryDialogProps {
    open: boolean,
    onCloseFn: any
}

const useStyles = makeStyles((theme) => {
    return {
        title: {
            fontWeight: 'bold',
            fontSize: '.95rem'
        },
        subtitle: {
            fontWeight: 'normal',
            fontSize: '.8rem',
            marginTop: '.4rem'
        },
        content: {
            padding: '0 !important',
            position: 'relative',
            width: '100%'
        },
        right: {
            position: 'absolute',
            right: 0,
            top: 0
        },
        dialogContent: {
            paddingLeft: '.8rem',
            paddingRight: '.8rem'
        }
    }
});

const Transition = React.forwardRef(
    (props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => 
        <Slide direction="up" ref={ref} {...props} />)

const HistoryItem = (props: { entry: MementoHistoryEntry, idx: number, onCloseFn: Function, historySize: number }) => {
    const { entry, idx, onCloseFn, historySize } = props;
    const [ open, setOpen ] = useState(false);
    const classes = useStyles();

    const memento: PageMemento = {
        timestamp: entry.mementoTimestamp,
        date: arquivoDateToDate(entry.mementoTimestamp)
    }

    const url = useSelector(selectArquivoData)?.url;
    if (url == null) return <h1>ERROR</h1>;
    const urlObj = new URL(url);
    const currentURL = urlObj.hostname + urlObj.pathname;

    return <>
        <ListItem button onClick={setOpen.bind(undefined, true)}>
            <CardContent className={classes.content}>
                <Typography variant="subtitle1" className={classes.title}>
                    {entry.title}
                </Typography>
                <Typography variant="caption">
                    {entry.url}
                </Typography>
                <Typography variant="subtitle2" className={classes.subtitle}>
                    {contentText.mementoList.viewingMementoCard.subHeader + " " + getHumanReadableDate(arquivoDateToDate(entry.mementoTimestamp), contentText.dates.weekdays.long, contentText.dates.dayLabel, contentText.dates.locale, contentText.dates.months.long)}
                </Typography>
                <Typography variant="caption" className={classes.right}>
                    {timeago.format(entry.viewedTimestamp)}
                </Typography>
            </CardContent>
        </ListItem>
        <MementoEntryActions contentScriptActions={currentURL == entry.url} memento={memento} url={entry.url} open={open} closeAncestors={onCloseFn} onCloseFn={setOpen.bind(undefined, false)} />
        { idx == historySize - 1 ? null : <Divider/> }
    </>;
}


const HistoryDialog = (props: HistoryDialogProps) => {
    const { open, onCloseFn } = props;
    const history = useSelector(selectHistory);
    const historyState = useSelector(selectHistoryStatus);
    const classes = useStyles();

    const reversedHistory = [ ...history ];
    reversedHistory.reverse();  // most recent to oldest

    // const url = new URL();
    // const currentPageUrl = 
  
    return <Dialog fullScreen open={open} onClose={onCloseFn} TransitionComponent={Transition}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onCloseFn} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6">
                        {contentText.history.title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent className={classes.dialogContent}>
                <List>
                    {reversedHistory.map((entry: MementoHistoryEntry, idx: number) => <HistoryItem entry={entry} idx={idx} onCloseFn={onCloseFn} historySize={history.length} />)}
                </List>
            </DialogContent>
        </Dialog>    
}

export { HistoryDialog }
