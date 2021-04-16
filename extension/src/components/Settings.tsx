import { Dialog, AppBar, Toolbar, IconButton, Typography, Slide, DialogContent, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Switch, Select, MenuItem, makeStyles, Divider, Slider } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React, { useState } from 'react'
import { TransitionProps } from '@material-ui/core/transitions'
import AutorenewIcon from '@material-ui/icons/Autorenew'
import { useSelector, useDispatch } from 'react-redux'
import { changeLanguage, selectDefaultEntitiesState, selectHistoryMax, selectLanguage, selectLanguageText, selectRetrieveAtLoad, setHistoryMax, toggleDefaultEntitiesState, toggleRetrieveAtLoad } from '../store/settingsSlice'
import TranslateIcon from '@material-ui/icons/Translate';
import { languageAsStr, strAsLanguage } from '../store/storeInterfaces'
import HistoryIcon from '@material-ui/icons/History'
import PeopleIcon from '@material-ui/icons/People';

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
            marginRight: '6rem'
        },
        item: {
            paddingLeft: '.6rem',
            paddingRight: '.6rem'
        },
        slider: {
            width: '5rem'
        }
    }
});

const SettingsDialog = (props: SettingsDialogProps) => {
    const { open, onCloseFn } = props;
    const dispatch = useDispatch();

    const retrieveAtLoad = useSelector(selectRetrieveAtLoad);
    const language = languageAsStr(useSelector(selectLanguage));
    const contentText = useSelector(selectLanguageText);
    const maxHistoryEntries = useSelector(selectHistoryMax);
    const defaultEntitiesState = useSelector(selectDefaultEntitiesState);

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
                            <HistoryIcon />
                        </ListItemIcon>
                        <ListItemText primary={contentText.settings.historyMaxNEntries.primary} className={classes.itemText} />
                        <ListItemSecondaryAction>
                        <Slider
                            value={maxHistoryEntries}
                            step={10}
                            min={10}
                            max={200}
                            onChange={(_event, value) => typeof value == "number" ? dispatch(setHistoryMax({ value, write: false })) : console.error("Received number array in settings slider!")}
                            onChangeCommitted={(_event, value: number | number[]) => typeof value == "number" ? dispatch(setHistoryMax({ value, write: true })) : console.error("Received number array in settings slider!")}
                            valueLabelDisplay="auto"
                            className={classes.slider}
                        />
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
                    <Divider />
                    <ListItem className={classes.item}>
                        <ListItemIcon className={classes.icon}>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary={contentText.settings.defaultEntitiesState.primary} className={classes.itemText} />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                color="primary"
                                onChange={() => dispatch(toggleDefaultEntitiesState(defaultEntitiesState))}
                                checked={defaultEntitiesState}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </DialogContent>
        </Dialog>    
}

export { SettingsDialog }
