import { CircularProgress, Box } from '@material-ui/core'

const Loading = () => 
    <Box mt={6} mb={6} display="flex" justifyContent="center">
        <CircularProgress />
    </Box>

export { Loading }
