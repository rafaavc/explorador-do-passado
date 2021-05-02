import { DialogContentText, DialogContent, Dialog, Button, DialogTitle, DialogActions } from "@material-ui/core"
import * as React from "react"
import contentText from "../text/pt.json"

interface InfoDialogProps {
    open: boolean,
    onCloseFn: any
}

export const InfoDialog = (props: InfoDialogProps) => {
    const { open, onCloseFn } = props;
  
    return <Dialog onClose={onCloseFn} aria-labelledby="info-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">{contentText.info.titleBeginning + contentText.extensionTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {contentText.info.content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => window.open(contentText.info.arquivoURL, "_blank")} color="primary">
                    {contentText.info.arquivoButtonText}
                </Button>
                <Button onClick={onCloseFn} color="primary" autoFocus>
                    {contentText.info.closeButtonText}
                </Button>
            </DialogActions>
        </Dialog>
}