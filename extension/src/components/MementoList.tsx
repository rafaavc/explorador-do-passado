import { ListItem, ListItemText, Fade, List, Collapse, Typography, Box } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { ArquivoMemento, PageMemento } from '../utils/ArquivoData'
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useState } from 'react';
import React from 'react';

interface MementoListProps {
    memento: ArquivoMemento,
    url: string
}

interface YearState{
    year: number,
    open: boolean,
    setOpen: Function
}

const renderRow = (mementoList: PageMemento[], url: string, fade: boolean, props: ListChildComponentProps) => {
    const { index, style } = props;
    const date = mementoList[index].date
    const timestamp = mementoList[index].timestamp

    const openMemento = (url: string, timestamp: string): void => {
        if (process.env.NODE_ENV === "production") chrome.tabs.create({ url: `https://arquivo.pt/noFrame/replay/${timestamp}/${url}`, active: true })
    }

    return <Fade in={fade}>
            <ListItem button style={style} key={index} onClick={openMemento.bind(undefined, url, timestamp)}>
                <ListItemText primary={date.toDateString()} />
            </ListItem>
        </Fade>
}

interface YearListProps {
    mementos: PageMemento[],
    url: string,
    fade: boolean
}

const YearList = (props: YearListProps) => {
    const { mementos, url, fade } = props

    return <FixedSizeList height={Math.min(400, mementos.length*46)} itemCount={mementos.length} itemSize={46} width={"100%"}>
        {renderRow.bind(undefined, mementos, url, fade)}
    </FixedSizeList>
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
    
    return <Box mb={3} mt={2}>
        <Typography variant="subtitle2">Versões antigas</Typography>
        { memento.list.length === 0 ? <Typography variant="body2">Não foram encontradas versões antigas.</Typography> : 
        <List>
            {years.map((year: YearState) => {
                const mementos = memento.list.filter((memento) => memento.date.getFullYear() == year.year)
                return <React.Fragment key={year.year}>
                    <ListItem button onClick={open.bind(undefined, year)}>
                        <ListItemText primary={year.year} secondary={mementos.length + " vers" + (mementos.length == 1 ? "ão" : "ões")} />
                        {year.open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={year.open} timeout="auto" unmountOnExit>
                        <YearList mementos={mementos} url={url} fade={year.open} />
                    </Collapse>
                </React.Fragment>
            })}
        </List>}
    </Box>
}


export { MementoList }


