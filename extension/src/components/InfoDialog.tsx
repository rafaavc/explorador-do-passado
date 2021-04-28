import { DialogContentText, DialogContent, Dialog, Button, DialogTitle, DialogActions } from "@material-ui/core"
import { useSelector } from "react-redux";
import { selectLanguageText } from "../store/settingsSlice";
import { openURL } from "../utils/URL";

interface InfoDialogProps {
    open: boolean,
    onCloseFn: any
}

export const InfoDialog = (props: InfoDialogProps) => {
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
                <Button onClick={openURL.bind(undefined, "https://github.com/rafaavc/explorador-do-passado")} color="primary">
                    {contentText.info.githubButtonText}
                </Button>
                <Button onClick={openURL.bind(undefined, contentText.info.arquivoURL)} color="primary">
                    {contentText.info.arquivoButtonText}
                </Button>
                <Button onClick={onCloseFn} color="primary" autoFocus>
                    {contentText.general.closeButtonText}
                </Button>
            </DialogActions>
        </Dialog>
}