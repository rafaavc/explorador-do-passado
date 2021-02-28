import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, DialogContent, DialogContentText } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import { TransitionProps } from '@material-ui/core/transitions'
import contentText from '../text/en.json'

interface SettingsDialogProps {
    open: boolean,
    onCloseFn: any
}

const Transition = React.forwardRef(
    (props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => 
        <Slide direction="up" ref={ref} {...props} />)

const SettingsDialog = (props: SettingsDialogProps) => {
    const { open, onCloseFn } = props
  
    return <Dialog fullScreen open={open} onClose={onCloseFn} TransitionComponent={Transition}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onCloseFn} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6">
                        {contentText.settings.title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {contentText.settings.content}
                </DialogContentText>
            </DialogContent>
        </Dialog>    
}

export { SettingsDialog }
