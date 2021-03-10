import { MementoViewingCard } from './MementoViewingCard'

interface SideBySideStateProps {
    timestamp: String
}

export const SideBySideState = (props: SideBySideStateProps) => {
    return <MementoViewingCard timestamp={props.timestamp} />
}

