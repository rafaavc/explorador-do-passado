import { Link, makeStyles, Typography } from "@material-ui/core"
import { useSelector } from "react-redux";
import { selectLanguageText } from "../store/settingsSlice";
import { openURL } from "../utils/URL";

const useStyles = makeStyles(() => {
    return {
        title: {
            marginTop: '1rem',
            fontWeight: 700
        },
        link: {
            cursor: 'pointer'
        }
    }
});

export const Error = (props: { msg: any }) => {
    const styles = useStyles();
    const textContent = useSelector(selectLanguageText);
    // TODO make error title and message based on language
    return <>
        <Typography className={styles.title} variant="h5">
            {textContent.error.title}
        </Typography>
        <Typography variant="body1">
            {props.msg}
        </Typography>
        <Link variant="body2" className={styles.link} onClick={() => openURL('https://github.com/rafaavc/arquivo-handbook/issues')}>{textContent.error.githubIssue}</Link>
    </>;
}