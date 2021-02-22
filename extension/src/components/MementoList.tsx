import { ListItem, ListItemText, Fade } from '@material-ui/core'
import { PageMemento } from '../utils/ArquivoData'
import { arquivoDateToDate } from '../utils/ArquivoDate'
import { FixedSizeList, ListChildComponentProps } from 'react-window';

interface MementoListProps {
    memento: Array<PageMemento>,
    url: string
}

const renderRow = (memento: PageMemento[], props: ListChildComponentProps) => {
    const { index, style } = props;
    const date = arquivoDateToDate(memento[index].timestamp)
  
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
    
    return <FixedSizeList height={400} itemCount={memento.length} itemSize={46} width={"100%"}>
        {renderRow.bind(undefined, memento)}
    </FixedSizeList>
}


export { MementoList }


