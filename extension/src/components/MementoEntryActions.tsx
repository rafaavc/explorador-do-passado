import { Button, Dialog, DialogActions, DialogTitle, List, ListItem, ListItemIcon, ListItemText, Snackbar, SnackbarContent } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectArquivoData } from "../store/dataSlice";
import { ArquivoData, PageMemento } from "../utils/ArquivoData";
import contentText from "../text/en.json";
import { getMementoURL, openMemento } from "../utils/URL";
import { openSideBySide, openTextDiff } from "../utils/ContentActions";
import { copyToClipboard } from "../utils/Clipboard";
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

export const MementoEntryActions = (props: MementoEntryActionsProps) => {
    const { open, onCloseFn, closeAncestors, memento, url } = props;

    const [ feedback, setFeedback ] = useState({ open: false, message: ""})
    const dispatch = useDispatch();

    const closeAll = () => {
        onCloseFn();
        closeAncestors();
    }

    const arquivoData: ArquivoData<PageMemento> | null = useSelector(selectArquivoData);

    return <>
        <Dialog onClose={onCloseFn} aria-labelledby="info-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{contentText.mementoList.entryActions.title}</DialogTitle>
            <List>
                <ListItem button onClick={openMemento.bind(undefined, url, memento.timestamp)}>
                    <ListItemIcon>
                        <OpenInNewIcon />
                    </ListItemIcon>
                    <ListItemText primary={contentText.mementoList.entryActions.newTab.primary} secondary={contentText.mementoList.entryActions.newTab.secondary} />
                </ListItem>
                <ListItem button onClick={() => { closeAll(); openSideBySide(url, memento.timestamp, dispatch); setFeedback({ open: true, message: contentText.mementoList.entryActions.sideBySide.successMsg });  }}>
                    <ListItemIcon>
                        <CompareIcon />
                    </ListItemIcon>
                    <ListItemText primary={contentText.mementoList.entryActions.sideBySide.primary} secondary={contentText.mementoList.entryActions.sideBySide.secondary} />
                </ListItem>
                <ListItem button onClick={() => { closeAll(); openTextDiff(url, memento.timestamp, arquivoData?.article, dispatch); setFeedback({ open: true, message: contentText.mementoList.entryActions.sideBySide.successMsg });  }}>
                    <ListItemIcon>
                        <SubjectIcon />
                    </ListItemIcon>
                    <ListItemText primary={contentText.mementoList.entryActions.textDiff.primary} secondary={contentText.mementoList.entryActions.textDiff.secondary} />
                </ListItem>
                <ListItem button onClick={() => { copyToClipboard(getMementoURL(url, memento.timestamp)); onCloseFn(); setFeedback({ open: true, message: contentText.mementoList.entryActions.copy.successMsg }); }}>
                    <ListItemIcon>
                        <FileCopyIcon />
                    </ListItemIcon>
                    <ListItemText primary={contentText.mementoList.entryActions.copy.primary} secondary={contentText.mementoList.entryActions.copy.secondary} />
                </ListItem>
            </List>
            <DialogActions>
                <Button onClick={onCloseFn} color="primary" autoFocus>
                    {contentText.general.closeButtonText}
                </Button>
            </DialogActions>
        </Dialog>
        <Snackbar open={feedback.open} autoHideDuration={3000} onClose={() => setFeedback({ open: false, message: "" })}>
            {/* <Alert onClose={() => setFeedbackOpen(false)} severity="success">  
                Success!
            </Alert> */}
            <SnackbarContent message={feedback.message}/>
        </Snackbar>
    </>
}