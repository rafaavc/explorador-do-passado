import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, DialogContent, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Switch } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import { TransitionProps } from '@material-ui/core/transitions'
import contentText from '../text/en.json'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import { useSelector } from 'react-redux'
import { selectHistory, selectHistoryStatus } from '../store/historySlice'

interface HistoryDialogProps {
    open: boolean,
    onCloseFn: any
}

const Transition = React.forwardRef(
    (props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => 
        <Slide direction="up" ref={ref} {...props} />)

const HistoryDialog = (props: HistoryDialogProps) => {
    const { open, onCloseFn } = props;
    const history = useSelector(selectHistory);
    const historyState = useSelector(selectHistoryStatus);
  
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
            <DialogContent>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <AutorenewIcon />
                        </ListItemIcon>
                        <ListItemText id="switch-list-label-wifi" primary="Retrieve pages on load" />
                        <ListItemSecondaryAction>

                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>    
}

export { HistoryDialog }
