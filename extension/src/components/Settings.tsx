import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, DialogContent, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Switch } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React, { useState } from 'react'
import { TransitionProps } from '@material-ui/core/transitions'
import contentText from '../text/en.json'
import AutorenewIcon from '@material-ui/icons/Autorenew'

interface SettingsDialogProps {
    open: boolean,
    onCloseFn: any
}

const Transition = React.forwardRef(
    (props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => 
        <Slide direction="up" ref={ref} {...props} />)

const SettingsDialog = (props: SettingsDialogProps) => {
    const { open, onCloseFn } = props

    const [ active, setActive ] = useState(true)
  
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
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <AutorenewIcon />
                        </ListItemIcon>
                        <ListItemText id="switch-list-label-wifi" primary="Retrieve pages on load" />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                color="primary"
                                onChange={() => setActive(!active)}
                                checked={active}
                                inputProps={{ 'aria-labelledby': 'switch-list-label-wifi' }}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>    
}

export { SettingsDialog }
