import { ListItem, ListItemText, Fade, List, Collapse, Typography, Box, Divider, makeStyles, createStyles, Theme } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { ArquivoMemento, PageMemento } from '../utils/ArquivoData'
import { FixedSizeList, ListChildComponentProps } from 'react-window'
import React, { useState } from 'react'
import contentText from '../text/pt.json'

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

const renderRow = (mementoList: PageMemento[], url: string, fade: boolean, itemClassName: string, props: ListChildComponentProps) => {
    const { index, style } = props;
    const date = mementoList[index].date
    const timestamp = mementoList[index].timestamp

    const openMemento = (url: string, timestamp: string): void => {
        if (process.env.NODE_ENV === "production") chrome.tabs.create({ url: `https://arquivo.pt/noFrame/replay/${timestamp}/${url}`, active: true })
    }

    return <Fade in={fade}>
            <ListItem button dense style={style} key={index} className={itemClassName} onClick={openMemento.bind(undefined, url, timestamp)}>
                <ListItemText primary={contentText.dates.weekdays.long[date.getDay()] + " " + contentText.dates.dayLabel + " " + date.getDate() + " (" + date.toLocaleTimeString(contentText.dates.locale, {hour: '2-digit', minute:'2-digit'}) + ")"} />
            </ListItem>
        </Fade>
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

    return <List>
        {months.map((month) => <React.Fragment key={month.month}>
            <ListItem dense button onClick={open.bind(undefined, month)} className={classes.nested}>
                <ListItemText primary={contentText.dates.months.long[month.month]} secondary={month.mementos.length + " " + contentText.mementoList.versionLabel.prefix + (month.mementos.length == 1 ? contentText.mementoList.versionLabel.suffixSingular : contentText.mementoList.versionLabel.suffixPlural)} />
                {month.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={month.open} timeout="auto" unmountOnExit>
                <FixedSizeList height={Math.min(400, month.mementos.length*46)} itemCount={month.mementos.length} itemSize={46} width={"100%"}>
                    {renderRow.bind(undefined, month.mementos, url, month.open, classes.nested)}
                </FixedSizeList>
            </Collapse>
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
            years.forEach((y) => { y.year != year.year && y.open && y.setOpen(false) })
        }
        year.setOpen(!year.open)
    }
    
    return <Box mb={3} mt={3}>
        <Typography variant="subtitle2">{contentText.mementoList.title}</Typography>
        { memento.list.length === 0 ? <Typography variant="body2">{contentText.mementoList.notFoundMessage}</Typography> : 
        <List>
            {years.map((year: YearState, idx: number) => {
                const mementos = memento.list.filter((memento) => memento.date.getFullYear() == year.year)
                return <React.Fragment key={year.year}>
                    <ListItem button onClick={open.bind(undefined, year)}>
                        <ListItemText primary={year.year} secondary={mementos.length + " vers" + (mementos.length == 1 ? "ão" : "ões")} />
                        {year.open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={year.open} timeout="auto" unmountOnExit>
                        <YearList mementos={mementos} url={url} />
                    </Collapse>
                    <Divider/>
                </React.Fragment>
            })}
        </List>}
    </Box>
}


export { MementoList }


