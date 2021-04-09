import { Button, Dialog, DialogActions, DialogTitle, List, ListItem, ListItemIcon, ListItemText, makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { selectArquivoData } from "../store/dataSlice";
import { ArquivoData, PageMemento } from "../utils/ArquivoData";
import contentText from "../text/en.json";
import { openMemento } from "../utils/URL";
import { copyMementoURLToClipboard, openSideBySide, openTextDiff } from "../utils/ContentActions";
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import CompareIcon from '@material-ui/icons/Compare'
import SubjectIcon from '@material-ui/icons/Subject'
import FileCopyIcon from '@material-ui/icons/FileCopy'


interface MementoEntryActionsProps {
    open: boolean,
    onCloseFn: any,
    memento: PageMemento,
    url: string,
    closeAncestors: any
}

const useStyles = makeStyles((theme) => {
    return {
        title: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(1),
            paddingLeft: theme.spacing(2.4)
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

    const dispatch = useDispatch();
    const classes = useStyles();

    const closeAll = () => {
        onCloseFn();
        closeAncestors();
    }

    const arquivoData: ArquivoData<PageMemento> | null = useSelector(selectArquivoData);

    return <>
        <Dialog onClose={onCloseFn} open={open}>
            <DialogTitle className={classes.title}>{contentText.mementoList.entryActions.title}</DialogTitle>
            <List className={classes.list}>
                <ListItem dense button onClick={openMemento.bind(undefined, url, memento.timestamp)}>
                    <ListItemIcon className={classes.icon}>
                        <OpenInNewIcon />
                    </ListItemIcon>
                    <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.newTab.primary} secondary={contentText.mementoList.entryActions.newTab.secondary} />
                </ListItem>
                <ListItem dense button onClick={() => { closeAll(); openSideBySide(url, memento.timestamp, arquivoData?.article, dispatch); }}>
                    <ListItemIcon className={classes.icon}>
                        <CompareIcon />
                    </ListItemIcon>
                    <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.sideBySide.primary} secondary={contentText.mementoList.entryActions.sideBySide.secondary} />
                </ListItem>
                <ListItem dense button onClick={() => { closeAll(); openTextDiff(url, memento.timestamp, arquivoData?.article, dispatch); }}>
                    <ListItemIcon className={classes.icon}>
                        <SubjectIcon />
                    </ListItemIcon>
                    <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.textDiff.primary} secondary={contentText.mementoList.entryActions.textDiff.secondary} />
                </ListItem>
                <ListItem dense button onClick={() => { copyMementoURLToClipboard(url, memento.timestamp, dispatch); onCloseFn(); }}>
                    <ListItemIcon className={classes.icon}>
                        <FileCopyIcon />
                    </ListItemIcon>
                    <ListItemText secondaryTypographyProps={{ className: classes.textSecondary }} primary={contentText.mementoList.entryActions.copy.primary} secondary={contentText.mementoList.entryActions.copy.secondary} />
                </ListItem>
            </List>
            <DialogActions>
                <Button onClick={onCloseFn} color="primary" autoFocus>
                    {contentText.general.closeButtonText}
                </Button>
            </DialogActions>
        </Dialog>
    </>
}