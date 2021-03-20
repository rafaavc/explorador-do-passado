import { Card, CardHeader, CardContent, Typography, CardActions, IconButton, Tooltip } from '@material-ui/core'
import CompareIcon from '@material-ui/icons/Compare'
import CloseIcon from '@material-ui/icons/Close'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import SubjectIcon from '@material-ui/icons/Subject'
import contentText from '../text/en.json'
import { closeSideBySide } from '../utils/ContentActions'
import { useDispatch } from 'react-redux'

interface MementoViewingCardProps {
    timestamp: String
}

export const MementoViewingCard = (props: MementoViewingCardProps) => <Card>
        <CardHeader
            avatar={ <CompareIcon/> }
            // action={
            //     <IconButton aria-label="settings">
            //         <MoreVertIcon />
            //     </IconButton>
            // }
            title={contentText.mementoList.entryActions.sideBySide.primary}
            subheader={contentText.mementoList.viewingMementoCard.subHeader + " " + props.timestamp} />
        {/* <CardMedia
            className={classes.media}
            image="/static/images/cards/paella.jpg"
            title="Paella dish"
        /> */}
        {/* <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
                This impressive paella is a perfect party dish and a fun meal to cook together with your
                guests. Add 1 cup of frozen peas along with the mussels, if you like.
            </Typography>
        </CardContent> */}
        <CardActions disableSpacing>
            <Tooltip title={contentText.mementoList.entryActions.textDiff.primary}>
                <IconButton aria-label={contentText.mementoList.entryActions.textDiff.primary}>
                    <SubjectIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={contentText.mementoList.entryActions.newTab.primary}>
                <IconButton aria-label={contentText.mementoList.entryActions.newTab.primary}>
                    <OpenInNewIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={contentText.mementoList.entryActions.copy.primary}>
                <IconButton aria-label={contentText.mementoList.entryActions.copy.primary}>
                    <ScreenShareIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title={contentText.mementoList.viewingMementoCard.close}>
                <IconButton aria-label={contentText.mementoList.viewingMementoCard.close} onClick={closeSideBySide.bind(undefined, useDispatch())}>
                    <CloseIcon />
                </IconButton>
            </Tooltip>
        </CardActions>
    </Card>

