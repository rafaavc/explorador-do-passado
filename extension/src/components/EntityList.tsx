import { ArquivoEntity } from '../utils/ArquivoData'
import { Box, Chip } from '@material-ui/core'
import FaceIcon from '@material-ui/icons/Face'
import BusinessIcon from '@material-ui/icons/Business'
import LocationOnIcon from '@material-ui/icons/LocationOn'

interface EntityListProps {
    entities: Array<ArquivoEntity>
}

const EntityList = (props: EntityListProps) => 
    <Box display="flex" my={2} justifyContent="center" gridGap={5} flexWrap="wrap">
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

export { EntityList }
