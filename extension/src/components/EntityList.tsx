import { ArquivoEntity } from '../utils/ArquivoData'
import { Box, Chip, CardContent, makeStyles } from '@material-ui/core'
import FaceIcon from '@material-ui/icons/Face'
import BusinessIcon from '@material-ui/icons/Business'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import { useState } from 'react'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import PeopleIcon from '@material-ui/icons/People';
import { useSelector } from 'react-redux'
import { selectLanguageText } from '../store/settingsSlice'

/* THIS FILE IS NO LONGER USED (ROLLED-BACK FEATURE) */

interface EntityListProps {
    entities: Array<ArquivoEntity>,
    open: boolean
}

const useStyles = makeStyles((theme) => {
    return {
        wrapper: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2)
        }
    }
});

const EntityList = (props: EntityListProps) => {
    const [open, setOpen] = useState(props.open);
    const classes = useStyles();
    const contentText = useSelector(selectLanguageText);

    return <>
        <ListItem dense button onClick={setOpen.bind(undefined, !open)}>
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={contentText.entities.title} />
            {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <CardContent className={classes.wrapper}>
            <Box display="flex" justifyContent="center" gridGap={5} flexWrap="wrap">
                {props.entities.map((entity: ArquivoEntity, idx: number) => {
                    const icon = entity.type == "PER" ? <FaceIcon /> : (entity.type == "ORG" ? <BusinessIcon/> : <LocationOnIcon/>)
                    return <Chip
                        key={idx}
                        icon={icon}
                        label={entity.text}
                        clickable
                        color="primary"
                    />
                })}
            </Box>
            </CardContent>
        </Collapse>
    </>
}

export { EntityList }
