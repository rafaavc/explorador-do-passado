import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, DialogContent, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Switch, Select, MenuItem, makeStyles, Divider } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React from 'react'
import { TransitionProps } from '@material-ui/core/transitions'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import { useSelector, useDispatch } from 'react-redux'
import { changeLanguage, selectLanguage, selectLanguageText, selectRetrieveAtLoad, toggleRetrieveAtLoad } from '../store/settingsSlice'
import TranslateIcon from '@material-ui/icons/Translate';
import { languageAsStr, strAsLanguage } from '../store/storeInterfaces'

interface SettingsDialogProps {
    open: boolean,
    onCloseFn: any
}

const Transition = React.forwardRef(
    (props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => 
        <Slide direction="up" ref={ref} {...props} />)

const useStyles = makeStyles((theme) => {
    return {
        dialogContent: {
            paddingLeft: '.6rem',
            paddingRight: '.6rem'
        },
        icon: {
            minWidth: 0,
            marginRight: '1rem',
            color: theme.palette.text.primary
        },
        itemText: {
            marginRight: '4rem'
        },
        item: {
            paddingLeft: '.6rem',
            paddingRight: '.6rem'
        }
    }
});

const SettingsDialog = (props: SettingsDialogProps) => {
    const { open, onCloseFn } = props;
    const retrieveAtLoad = useSelector(selectRetrieveAtLoad);
    const dispatch = useDispatch();
    const language = languageAsStr(useSelector(selectLanguage));
    const contentText = useSelector(selectLanguageText);
    const classes = useStyles();
  
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
            <DialogContent className={classes.dialogContent}>
                <List>
                    <ListItem className={classes.item}>
                        <ListItemIcon className={classes.icon}>
                            <TranslateIcon />
                        </ListItemIcon>
                        <ListItemText primary={contentText.settings.language.primary} className={classes.itemText} />
                        <ListItemSecondaryAction>
                            <Select
                                value={language}
                                onChange={(event: any) => dispatch(changeLanguage(strAsLanguage(event.target.value)))}
                                displayEmpty
                            >
                                <MenuItem value={"PT"}>Português</MenuItem>
                                <MenuItem value={"EN"}>English</MenuItem>
                            </Select>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                    <ListItem className={classes.item}>
                        <ListItemIcon className={classes.icon}>
                            <AutorenewIcon />
                        </ListItemIcon>
                        <ListItemText primary={contentText.settings.retrieveAtLoad.primary} className={classes.itemText} />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                color="primary"
                                onChange={() => dispatch(toggleRetrieveAtLoad(retrieveAtLoad))}
                                checked={retrieveAtLoad}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>    
}

export { SettingsDialog }
