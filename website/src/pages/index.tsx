import { AppBar, Tooltip, IconButton, Toolbar, Typography, Link, makeStyles, Box } from "@material-ui/core"
import InfoIcon from '@material-ui/icons/Info'
import GitHubIcon from '@material-ui/icons/GitHub'
import * as React from "react"
import "./style.scss"
import contentText from "../text/pt.json"
import { InfoDialog } from "../components/InfoDialog"
import { useState } from "react"
import { Helmet } from "react-helmet"
import { useGlobalPaddingStyles } from "../components/GlobalStyles"
import { IndexContent } from "../components/IndexContent"
import favicon from "../images/favicon.ico"
import logo from "../images/logo.png"

const useStyles = makeStyles((theme) => {
  return {
    icon: {
      marginRight: '1rem',
      [theme.breakpoints.down('xs')]: {
        marginRight: '0rem'
      },
    },
    grow: {
      flexGrow: 1,
      userSelect: 'none',
      fontWeight: 700,
      [theme.breakpoints.down('xs')]: {
        fontSize: '1.1rem'
      },
    },
    logo: {
      maxHeight: '2.5rem',
      marginRight: '1rem',
      [theme.breakpoints.down('xs')]: {
        display: 'none'
      },
    }
  }
})
  
const IndexPage = () => {
  const classes = useStyles();
  const globalPaddingClasses = useGlobalPaddingStyles();
  const [open, setOpen] = useState(false);

  return (
    <main>
      <Helmet>
          <title>{contentText.extensionTitle}</title>
          <meta charSet="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href={favicon}  type="image/x-icon" />
      </Helmet>
      <AppBar position="static" className={globalPaddingClasses.padding}>
        <Toolbar disableGutters={true}>
          <div className={classes.logoWrapper}><img src={logo} className={classes.logo} /></div>
          <Typography variant="h5" component="h1" className={classes.grow}>
            Explorador do Passado
          </Typography>
          <Tooltip title={contentText.github.tooltip}>
              <IconButton edge="start" color="inherit" className={classes.icon} onClick={() => window.open("https://github.com/rafaavc/explorador-do-passado", '_blank')} aria-label="menu">
                  <GitHubIcon />
              </IconButton>
          </Tooltip>
          <Tooltip title={contentText.info.tooltip}>
              <IconButton edge="start" color="inherit" onClick={() => setOpen(true)} aria-label="menu">
                  <InfoIcon />
              </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <IndexContent />
      <InfoDialog open={open} onCloseFn={() => setOpen(false)} />
    </main>
  )
}

export default IndexPage
