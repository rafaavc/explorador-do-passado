import { CardActions, IconButton, Tooltip, Typography, makeStyles, CardContent } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import { closeMementoViewing, copyMementoURLToClipboard, openMemento, openSideBySide, openTextDiff } from '../utils/ContentActions'
import { useDispatch, useSelector } from 'react-redux'
import { arquivoDateToDate, getHumanReadableDate } from '../utils/ArquivoDate'
import { selectArquivoCDXData, selectPageState } from '../store/dataSlice'
import { PageStateId } from '../utils/Page'
import { setFeedbackMessageAndOpen } from '../store/feedbackSlice'
import { selectHistory } from '../store/historySlice'
import { selectHistoryMax, selectLanguageText } from '../store/settingsSlice'
import { Error } from './Error'

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
    const history = useSelector(selectHistory);
    const dispatch = useDispatch();
    const contentText = useSelector(selectLanguageText);
    const maxHistoryEntries = useSelector(selectHistoryMax);

    const tmp = useSelector(selectArquivoCDXData);
    if (tmp == null) return <Error msg="ERROR in MementoViewingCard"/>;
    const arquivoCDXData = tmp;

    const toggleMementoViewingMode = () => {
        if (state.id == PageStateId.SHOWING_SIDE_BY_SIDE) 
        {
            openTextDiff(contentText, history, maxHistoryEntries, arquivoCDXData?.url, state.data, arquivoCDXData?.title, dispatch);
        } 
        else if (state.id == PageStateId.SHOWING_TEXT_DIFF)
        {
            openSideBySide(contentText, history, maxHistoryEntries, arquivoCDXData?.url, state.data, arquivoCDXData?.title, dispatch);
            dispatch(setFeedbackMessageAndOpen(contentText.mementoList.entryActions.sideBySide.successMsg));
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
            <Tooltip title={contentText.mementoList.viewingMementoCard.actions.newTab}>
                <IconButton aria-label={contentText.mementoList.viewingMementoCard.actions.newTab} className={classes.button} onClick={() => openMemento(history, maxHistoryEntries, arquivoCDXData?.title, arquivoCDXData?.url, state.data, dispatch)}>
                    <OpenInNewIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={state.id == PageStateId.SHOWING_TEXT_DIFF ? contentText.mementoList.viewingMementoCard.actions.sideBySide : contentText.mementoList.viewingMementoCard.actions.textDiff}>
                <IconButton aria-label={state.id == PageStateId.SHOWING_TEXT_DIFF ? contentText.mementoList.viewingMementoCard.actions.sideBySide : contentText.mementoList.viewingMementoCard.actions.textDiff} className={classes.button} onClick={toggleMementoViewingMode}>
                    <span className="material-icons">{state.id == PageStateId.SHOWING_SIDE_BY_SIDE ? "notes" : "compare"}</span>
                </IconButton>
            </Tooltip>
            <Tooltip title={contentText.mementoList.viewingMementoCard.actions.copy}>
                <IconButton aria-label={contentText.mementoList.viewingMementoCard.actions.copy} className={classes.button} onClick={() => copyMementoURLToClipboard(contentText, history, maxHistoryEntries, arquivoCDXData?.title, arquivoCDXData?.url, state.data, dispatch)}>
                    <span className="material-icons">content_copy</span>
                </IconButton>
            </Tooltip>
            <Tooltip title={contentText.mementoList.viewingMementoCard.actions.close}>
                <IconButton aria-label={contentText.mementoList.viewingMementoCard.actions.close} className={classes.button} onClick={closeMementoViewing.bind(undefined, contentText, useDispatch())}>
                    <CloseIcon />
                </IconButton>
            </Tooltip>
        </CardActions>
    </>
}

