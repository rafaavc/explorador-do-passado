import { CardActions, IconButton, Tooltip, Typography, makeStyles, CardContent } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import contentText from '../text/en.json'
import { closeMementoViewing, openSideBySide, openTextDiff } from '../utils/ContentActions'
import { useDispatch, useSelector } from 'react-redux'
import { arquivoDateToDate, getHumanReadableDate } from '../utils/ArquivoDate'
import { selectArquivoData, selectPageState } from '../store/dataSlice'
import { PageStateId } from '../utils/Page'
import { getMementoURL, openURL } from '../utils/URL'
import { copyToClipboard } from '../utils/Clipboard'

interface MementoViewingCardProps {
    timestamp: string
}

const useStyles = makeStyles((theme) => {
    return {
        title: {
            fontWeight: 'bold',
            fontSize: '.95rem'
        },
        subtitle: {
            fontWeight: 'normal',
            fontSize: '.8rem'
        },
        wrapper: {
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(0)
        },
        button: {
            color: theme.palette.text.primary
        }
    }
});

export const MementoViewingCard = (props: MementoViewingCardProps) => {
    const classes = useStyles();
    const state = useSelector(selectPageState);
    const arquivoData = useSelector(selectArquivoData);
    const dispatch = useDispatch();

    const toggleMementoViewingMode = () => {
        if (state.id == PageStateId.SHOWING_SIDE_BY_SIDE) 
        {
            openTextDiff(arquivoData?.url, state.data, arquivoData?.article, dispatch);
        } 
        else if (state.id == PageStateId.SHOWING_TEXT_DIFF)
        {
            openSideBySide(arquivoData?.url, state.data, arquivoData?.article, dispatch);
        }
    }

    return <>
        <CardContent className={classes.wrapper}>
            <Typography variant="subtitle1" className={classes.title}>
                {contentText.mementoList.viewingMementoCard.header + " " + (state.id == PageStateId.SHOWING_SIDE_BY_SIDE ? contentText.mementoList.viewingMementoCard.sideBySide : contentText.mementoList.viewingMementoCard.textDiff)}
            </Typography>
            <Typography variant="subtitle2" className={classes.subtitle}>
                {contentText.mementoList.viewingMementoCard.subHeader + " " + getHumanReadableDate(arquivoDateToDate(props.timestamp), contentText.dates.weekdays.long, contentText.dates.dayLabel, contentText.dates.locale, contentText.dates.months.long)}
            </Typography>
        </CardContent>
        <CardActions disableSpacing>
            <Tooltip title={contentText.mementoList.entryActions.newTab.primary}>
                <IconButton aria-label={contentText.mementoList.entryActions.newTab.primary} className={classes.button} onClick={() => openURL(getMementoURL(arquivoData?.url, state.data))}>
                    <OpenInNewIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={state.id == PageStateId.SHOWING_TEXT_DIFF ? contentText.mementoList.entryActions.sideBySide.primary : contentText.mementoList.entryActions.textDiff.primary}>
                <IconButton aria-label={state.id == PageStateId.SHOWING_TEXT_DIFF ? contentText.mementoList.entryActions.sideBySide.primary : contentText.mementoList.entryActions.textDiff.primary} className={classes.button} onClick={toggleMementoViewingMode}>
                    <span className="material-icons">{state.id == PageStateId.SHOWING_SIDE_BY_SIDE ? "notes" : "compare"}</span>
                </IconButton>
            </Tooltip>
            <Tooltip title={contentText.mementoList.entryActions.copy.primary}>
                <IconButton aria-label={contentText.mementoList.entryActions.copy.primary} className={classes.button} onClick={() => copyToClipboard(getMementoURL(arquivoData?.url, state.data))}>
                    <span className="material-icons">content_copy</span>
                </IconButton>
            </Tooltip>
            <Tooltip title={contentText.mementoList.viewingMementoCard.close}>
                <IconButton aria-label={contentText.mementoList.viewingMementoCard.close} className={classes.button} onClick={closeMementoViewing.bind(undefined, useDispatch())}>
                    <CloseIcon />
                </IconButton>
            </Tooltip>
        </CardActions>
    </>
}

