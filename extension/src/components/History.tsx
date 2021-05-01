import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, DialogContent, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Switch, makeStyles, CardContent, Divider, Tooltip } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'
import { useDispatch, useSelector } from 'react-redux'
import { deleteHistory, selectHistory, selectHistoryStatus } from '../store/historySlice'
import { MementoHistoryEntry, PageMemento } from '../utils/ArquivoData'
import { arquivoDateToDate, getHumanReadableDate } from '../utils/ArquivoDate'
import { MementoEntryActions } from './MementoEntryActions'
import { selectArquivoData } from '../store/dataSlice'
import { selectLanguage, selectLanguageText } from '../store/settingsSlice'
import * as timeago from 'timeago.js'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import React, { useState } from 'react'
import { Language } from '../utils/Language'

interface HistoryDialogProps {
    open: boolean,
    onCloseFn: any
}

const useStyles = makeStyles((theme) => {
    return {
        title: {
            fontWeight: 'bold',
            fontSize: '1.1rem',
            marginRight: '5.2rem',
            lineHeight: '1.3',
            marginBottom: '.3rem',
            marginTop: '.1rem'

        },
        subtitle: {
            fontWeight: 'normal',
            fontSize: '.9rem',
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
        },
        grow: {
            flexGrow: 1
        },
        noHistoryTitle: {
            fontSize: '1rem',
            marginTop: '1rem'
        }
    }
});

const ptLocale = (number: number, index: number): [string, string] => {
    const list: [string, string][] = [
        ['agora mesmo', 'agora'],
        ['há %s segundos', 'em %s segundos'],
        ['há um minuto', 'em um minuto'],
        ['há %s minutos', 'em %s minutos'],
        ['há uma hora', 'em uma hora'],
        ['há %s horas', 'em %s horas'],
        ['há um dia', 'em um dia'],
        ['há %s dias', 'em %s dias'],
        ['há uma semana', 'em uma semana'],
        ['há %s semanas', 'em %s semanas'],
        ['há um mês', 'em um mês'],
        ['há %s meses', 'em %s meses'],
        ['há um ano', 'em um ano'],
        ['há %s anos', 'em %s anos'],
    ];

    return list[index];
}

timeago.register('pt_PT', ptLocale);


const Transition = React.forwardRef(
    (props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => 
        <Slide direction="up" ref={ref} {...props} />)

const HistoryItem = (props: { entry: MementoHistoryEntry, idx: number, onCloseFn: Function, historySize: number }) => {
    const { entry, idx, onCloseFn, historySize } = props;
    const [ open, setOpen ] = useState(false);
    const classes = useStyles();
    
    const contentText = useSelector(selectLanguageText);
    const language: Language = useSelector(selectLanguage);

    const memento: PageMemento = {
        timestamp: entry.mementoTimestamp,
        date: arquivoDateToDate(entry.mementoTimestamp)
    }

    let url = useSelector(selectArquivoData)?.url;
    let currentURL: string | null = null;
    if (url == null) currentURL = "";
    else {
        const urlObj = new URL(url);
        currentURL = urlObj.hostname + urlObj.pathname;
    }

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
                    {timeago.format(entry.viewedTimestamp, language == Language.PT ? 'pt_PT' : undefined)}
                </Typography>
            </CardContent>
        </ListItem>
        <MementoEntryActions contentScriptActions={currentURL == entry.url} memento={memento} url={entry.url} open={open} closeAncestors={onCloseFn} onCloseFn={setOpen.bind(undefined, false)} />
        { idx == historySize - 1 ? null : <Divider/> }
    </>
}


const HistoryDialog = (props: HistoryDialogProps) => {
    const { open, onCloseFn } = props;
    const history = useSelector(selectHistory);
    const classes = useStyles();
    const dispatch = useDispatch();

    const reversedHistory = [ ...history ];
    reversedHistory.reverse();  // most recent to oldest

    const contentText = useSelector(selectLanguageText);
  
    return <Dialog fullScreen open={open} onClose={onCloseFn} TransitionComponent={Transition}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onCloseFn} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.grow}>
                        {contentText.history.title}
                    </Typography>
                    {reversedHistory.length != 0 ?
                    <Tooltip title={contentText.history.deleteTooltip}>
                        <IconButton edge="start" color="inherit" onClick={() => dispatch(deleteHistory())} aria-label="close">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip> : null }
                </Toolbar>
            </AppBar>
            <DialogContent className={classes.dialogContent}>
                {reversedHistory.length == 0 ? 
                    <>
                        <Typography variant="h6" className={classes.noHistoryTitle}>{contentText.history.noHistoryMsg.title}</Typography>
                        <Typography variant="body2">{contentText.history.noHistoryMsg.body}</Typography>
                    </> :
                <List>
                    {reversedHistory.map((entry: MementoHistoryEntry, idx: number) => <HistoryItem key={idx} entry={entry} idx={idx} onCloseFn={onCloseFn} historySize={history.length} />)}
                </List>}
            </DialogContent>
        </Dialog>
}

export { HistoryDialog }
