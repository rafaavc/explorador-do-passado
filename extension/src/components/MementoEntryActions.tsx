import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { selectArquivoData } from "../store/dataSlice";
import { ArquivoData, PageMemento } from "../utils/ArquivoData";
import { openMemento } from "../utils/ContentActions";
import { copyMementoURLToClipboard, openSideBySide, openTextDiff } from "../utils/ContentActions";
import { selectHistory } from "../store/historySlice";
import { selectHistoryMax, selectLanguageText } from "../store/settingsSlice";
import { useState } from "react";
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import CompareIcon from '@material-ui/icons/Compare'
import SubjectIcon from '@material-ui/icons/Subject'
import FileCopyIcon from '@material-ui/icons/FileCopy'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { openURL } from "../utils/URL";
import { copyToClipboard } from "../utils/Clipboard";
import { arquivoDateToDate, getHumanReadableDate } from "../utils/ArquivoDate";


interface MementoEntryActionsProps {
    open: boolean,
    onCloseFn: any,
    memento: PageMemento,
    url: string,
    closeAncestors: any,
    contentScriptActions?: boolean
}

const useStyles = makeStyles((theme) => {
    return {
        title: {
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(0.5),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        },
        date: {
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        },
        list: {
            paddingTop: 0,
            paddingBottom: 0
        },
        icon: {
            color: theme.palette.text.primary
        },
        textSecondary: {
            fontSize: ".85rem"
        }
    }
});

export const MementoEntryActions = (props: MementoEntryActionsProps) => {
    const { open, onCloseFn, closeAncestors, memento, url } = props;
    let { contentScriptActions } = props;

    if (contentScriptActions == null) contentScriptActions = true;

    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useSelector(selectHistory);
    const contentText = useSelector(selectLanguageText);
    const maxHistoryEntries = useSelector(selectHistoryMax);
    const [ originalActionsOpen, setOriginalActionsOpen ] = useState(false);
    const [ mementoActionsOpen, setMementoActionsOpen ] = useState(true);

    const customSetOriginalActionsOpen = (o: boolean) => {
        if (o) setMementoActionsOpen(false);
        setOriginalActionsOpen(o);
    }
    const customSetMementoActionsOpen = (o: boolean) => {
        if (o) setOriginalActionsOpen(false);
        setMementoActionsOpen(o);
    }

    const closeAll = () => {
        onCloseFn();
        closeAncestors();
    }

    const arquivoData: ArquivoData<PageMemento> | null = useSelector(selectArquivoData);

    return <>
        <Dialog onClose={onCloseFn} open={open}>
            <DialogTitle className={classes.title}>{contentText.mementoList.entryActions.title}</DialogTitle>
            <DialogContent className={classes.date}>
                <Typography variant="body1">
                    { getHumanReadableDate(arquivoDateToDate(memento.timestamp), contentText.dates.weekdays.long, contentText.dates.dayLabel, contentText.dates.locale) }
                </Typography>
            </DialogContent>
            <List className={classes.list}>
                {contentScriptActions ? <>
                    <ListItem dense button onClick={() => { closeAll(); openSideBySide(contentText, history, maxHistoryEntries, url, memento.timestamp, arquivoData?.article, dispatch); }}>
                        <ListItemIcon className={classes.icon}>
                            <CompareIcon />
                        </ListItemIcon>
                        <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.sideBySide.primary} secondary={contentText.mementoList.entryActions.sideBySide.secondary} />
                    </ListItem>
                    <ListItem dense button onClick={() => { closeAll(); openTextDiff(contentText, history, maxHistoryEntries, url, memento.timestamp, arquivoData?.article, dispatch); }}>
                        <ListItemIcon className={classes.icon}>
                            <SubjectIcon />
                        </ListItemIcon>
                        <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.textDiff.primary} secondary={contentText.mementoList.entryActions.textDiff.secondary} />
                    </ListItem>
                    <ListItem dense button onClick={() => openMemento(history, maxHistoryEntries, arquivoData?.article, url, memento.timestamp, dispatch)}>
                        <ListItemIcon className={classes.icon}>
                            <OpenInNewIcon />
                        </ListItemIcon>
                        <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.newTab.primary} secondary={contentText.mementoList.entryActions.newTab.secondary} />
                    </ListItem>
                    <ListItem dense button onClick={() => { copyMementoURLToClipboard(contentText, history, maxHistoryEntries, arquivoData?.article, url, memento.timestamp, dispatch); onCloseFn(); }}>
                        <ListItemIcon className={classes.icon}>
                            <FileCopyIcon />
                        </ListItemIcon>
                        <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.copy.primary} secondary={contentText.mementoList.entryActions.copy.secondary} />
                    </ListItem>
                </> :  <>
                    <Divider/>  
                    <ListItem dense button onClick={customSetMementoActionsOpen.bind(undefined, !mementoActionsOpen)}>
                        <ListItemText primary={contentText.mementoList.entryActions.mementoSection.title} />
                        {mementoActionsOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={mementoActionsOpen} timeout="auto" unmountOnExit>
                        <List className={classes.list}>
                            <ListItem dense button onClick={() => openMemento(history, maxHistoryEntries, arquivoData?.article, url, memento.timestamp, dispatch)}>
                                <ListItemIcon className={classes.icon}>
                                    <OpenInNewIcon />
                                </ListItemIcon>
                                <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.newTab.primary} secondary={contentText.mementoList.entryActions.newTab.secondary} />
                            </ListItem>
                            <ListItem dense button onClick={() => { copyMementoURLToClipboard(contentText, history, maxHistoryEntries, arquivoData?.article, url, memento.timestamp, dispatch); onCloseFn(); }}>
                                <ListItemIcon className={classes.icon}>
                                    <FileCopyIcon />
                                </ListItemIcon>
                                <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.copy.primary} secondary={contentText.mementoList.entryActions.copy.secondary} />
                            </ListItem>
                        </List>
                    </Collapse>
                    <Divider/>  
                    <ListItem dense button onClick={customSetOriginalActionsOpen.bind(undefined, !originalActionsOpen)}>
                        <ListItemText primary={contentText.mementoList.entryActions.originalSection.title} />
                        {originalActionsOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={originalActionsOpen} timeout="auto" unmountOnExit>
                        <List className={classes.list}>
                            <ListItem dense button onClick={() => openURL("http://" + url)}>
                                <ListItemIcon className={classes.icon}>
                                    <OpenInNewIcon />
                                </ListItemIcon>
                                <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.originalSection.newTab.primary} secondary={contentText.mementoList.entryActions.originalSection.newTab.secondary} />
                            </ListItem>
                            <ListItem dense button onClick={() => { copyToClipboard(url); onCloseFn(); }}>
                                <ListItemIcon className={classes.icon}>
                                    <FileCopyIcon />
                                </ListItemIcon>
                                <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.originalSection.copy.primary} secondary={contentText.mementoList.entryActions.originalSection.copy.secondary} />
                            </ListItem>
                        </List>
                    </Collapse>
                </> }
            </List>
            <DialogActions>
                <Button onClick={onCloseFn} color="primary" autoFocus>
                    {contentText.general.closeButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    </>
}