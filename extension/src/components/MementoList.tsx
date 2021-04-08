import { ListItem, ListItemText, Fade, List, Collapse, Typography, Box, Divider, makeStyles, createStyles, Theme, ListItemIcon, Snackbar, SnackbarContent } from '@material-ui/core'
import { Dialog, AppBar, Toolbar, IconButton, Slide } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { TransitionProps } from '@material-ui/core/transitions'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { ArquivoMemento, PageMemento } from '../utils/ArquivoData'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import React, { useRef, useState } from 'react'
import contentText from '../text/en.json'
import { getHumanReadableDate } from '../utils/ArquivoDate'
import { MementoEntryActions } from './MementoEntryActions'

interface MementoListProps {
    memento: ArquivoMemento,
    url: string
}

interface YearState {
    year: number,
    open: boolean,
    setOpen: Function
}

interface MonthState {
    month: number,
    open: boolean,
    setOpen: Function,
    mementos: PageMemento[]
}

const renderRow = (mementoList: PageMemento[], url: string, fade: boolean, closeAncestors: any, props: ListChildComponentProps) => {
    const { index, style } = props
    const date = mementoList[index].date

    const [ open, setOpen ] = useState(false)

    return <>
        <Fade in={fade}>
            <ListItem button dense style={style} key={index} onClick={setOpen.bind(undefined, true)}>
                <ListItemText primary={getHumanReadableDate(date, contentText.dates.weekdays.long, contentText.dates.dayLabel, contentText.dates.locale)} />
            </ListItem>
        </Fade>
        <MementoEntryActions memento={mementoList[index]} url={url} open={open} closeAncestors={closeAncestors} onCloseFn={setOpen.bind(undefined, false)} />
    </>
}

interface YearListProps {
    mementos: PageMemento[],
    url: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }),
)

const YearList = (props: YearListProps) => {
    const { mementos, url } = props
    const months: MonthState[] = []
    const classes = useStyles()

    const year = mementos[0].date.getFullYear()

    let previousMonth: any = -1
    for (const memento of mementos) {
        const month = memento.date.getMonth()
        if (previousMonth == -1 || month != previousMonth.month) {
            if (previousMonth != -1) months.push(previousMonth)

            const [open, setOpen] = useState(false)

            previousMonth = { month, mementos: [], open, setOpen }
            previousMonth.mementos.push(memento)
        } else {
            previousMonth.mementos.push(memento)
        }
    }
    if (previousMonth != -1) months.push(previousMonth)

    const open = (month: MonthState) => {
        if (!month.open) {
            months.forEach((m) => { m.month != month.month && m.open && m.setOpen(false) })
        }
        month.setOpen(!month.open)
    }

    const Transition = React.forwardRef(
        (props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => 
            <Slide direction="up" ref={ref} {...props} />)

    return <List>
        {months.map((month) => <React.Fragment key={month.month}>
            <ListItem dense button onClick={open.bind(undefined, month)} className={classes.nested}>
                <ListItemText primary={contentText.dates.months.long[month.month]} secondary={month.mementos.length + " " + (month.mementos.length == 1 ? contentText.mementoList.versionLabel.singular : contentText.mementoList.versionLabel.plural)} />
                {month.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {month.open ? <Dialog fullScreen open={true} onClose={open.bind(undefined, month)} TransitionComponent={Transition}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={open.bind(undefined, month)} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6">
                            {contentText.dates.months.long[month.month] + " " + year}
                        </Typography>
                    </Toolbar>
                </AppBar>
                <FixedSizeList height={window.innerHeight - 56} itemCount={month.mementos.length} itemSize={46} width={"100%"}>
                    {renderRow.bind(undefined, month.mementos, url, month.open, open.bind(undefined, month))}
                </FixedSizeList>
            </Dialog> : null}
        </React.Fragment>)}
    </List>
}

const MementoList = (props: MementoListProps) => {
    const { memento, url } = props;

    const years: Array<YearState> = []
    memento.years.forEach((year) => {
        const [open, setOpen] = useState(false)
        years.push({ year, open, setOpen })
    })

    const open = (year: YearState) => {
        if (!year.open) {
            years.forEach((y) => { y.year != year.year && y.open && y.setOpen(false) });
        }
        year.setOpen(!year.open);
    }

    const scrollHeaderToTop = (ref: any) => {
        document.querySelector("#ah-content-wrapper")?.scrollBy(0, ref.current.getBoundingClientRect().top-56);
    }
    
    return <Box mb={3} mt={3}>
        <Typography variant="subtitle2">{contentText.mementoList.title}</Typography>
        { memento.list.length === 0 ? <Typography variant="body2">{contentText.mementoList.notFoundMessage}</Typography> : 
        <List>
            {years.map((year: YearState, idx: number) => {
                const listItemRef = useRef(null);
                const mementos = memento.list.filter((memento) => memento.date.getFullYear() == year.year)
                return <React.Fragment key={year.year}>
                    <div ref={listItemRef}>
                        <ListItem dense button onClick={open.bind(undefined, year)}>
                            <ListItemText primary={year.year} secondary={mementos.length + " " + (mementos.length == 1 ? contentText.mementoList.versionLabel.singular : contentText.mementoList.versionLabel.plural)} />
                            {year.open ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                    </div>
                    <Collapse in={year.open} timeout={180} onEntered={scrollHeaderToTop.bind(undefined, listItemRef)} unmountOnExit>
                        <YearList mementos={mementos} url={url} />
                    </Collapse>
                    <Divider/>
                </React.Fragment>
            })}
        </List>}
    </Box>
}


export { MementoList }


