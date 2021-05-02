import { AppBar, Tooltip, IconButton, Toolbar, Typography, Link, makeStyles } from "@material-ui/core"
import InfoIcon from '@material-ui/icons/Info'
import GitHubIcon from '@material-ui/icons/GitHub'
import * as React from "react"
import "./style.scss"
import contentText from "../text/pt.json"
import { InfoDialog } from "../components/InfoDialog"
import { useState } from "react"
import { Helmet } from "react-helmet"

const useStyles = makeStyles(() => {
  return {
    icon: {
      marginRight: '1rem'
    },
    grow: {
      flexGrow: 1,
      cursor: 'pointer',
      userSelect: 'none'
    }
  }
})
  
const IndexPage = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  return (
    <main>
      <Helmet>
          <title>Explorador do Passado</title>
          <meta charset="utf-8"/>
          <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </Helmet>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.grow} onClick={() => window.scrollTo(0, 0)}>
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
      <InfoDialog open={open} onCloseFn={() => setOpen(false)} />
    </main>
  )
}

export default IndexPage
