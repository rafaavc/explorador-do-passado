import { ListItem, ListItemText, Fade, List, Collapse, ListItemIcon } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { ArquivoMemento, PageMemento } from '../utils/ArquivoData'
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useState } from 'react';

interface MementoListProps {
    memento: ArquivoMemento,
    url: string
}

interface YearState{
    year: number,
    open: boolean,
    setOpen: Function
}

const renderRow = (mementoList: PageMemento[], props: ListChildComponentProps) => {
    const { index, style } = props;
    const date = mementoList[index].timestamp
    console.log(date)
    return (
        <Fade in={true}>
            <ListItem button style={style} key={index}>
                <ListItemText primary={date.toDateString()} />
            </ListItem>
        </Fade>
    );
}

const MementoList = (props: MementoListProps) => {
    const { memento } = props;

    const years: Array<YearState> = []
    memento.years.forEach((year) => {
        const [open, setOpen] = useState(false)
        years.push({ year, open, setOpen })
    })

    const open = (year: YearState) => {
        if (!year.open) {
            years.forEach((y) => { y.year != year.year && y.setOpen(false) })
        }
        year.setOpen(!year.open)
    }
    
    return <List>
        {years.map((year: YearState) => {
            const mementos = memento.list.filter((memento) => memento.timestamp.getFullYear() == year.year)
            return <>
                <ListItem button onClick={open.bind(undefined, year)}>
                    <ListItemText primary={year.year} />
                    {year.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={year.open} timeout="auto" unmountOnExit>
                    <FixedSizeList height={400} itemCount={mementos.length} itemSize={46} width={"100%"}>
                        {renderRow.bind(undefined, mementos)}
                    </FixedSizeList>
                </Collapse>
            </>
        })}
    </List>
}


export { MementoList }


