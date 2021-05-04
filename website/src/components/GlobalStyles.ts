import { makeStyles } from "@material-ui/core"

export const useGlobalPaddingStyles = makeStyles((theme) => {
    return {
        padding: {
            paddingLeft: "15vw",
            paddingRight: "15vw",
            [theme.breakpoints.down('md')]: {
                paddingLeft: "10vw",
                paddingRight: "10vw",
            },
            [theme.breakpoints.down('sm')]: {
                paddingLeft: "5vw",
                paddingRight: "5vw",
            },
        }
    }
});

export const useGlobalHeadingStyles = makeStyles((theme) => {
    return {
        heading: {
            fontWeight: 700,
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(2)
        }
    }
})
