import { AppBar, Tooltip, IconButton, Toolbar, Typography, Link, makeStyles } from "@material-ui/core"
import InfoIcon from '@material-ui/icons/Info'
import GitHubIcon from '@material-ui/icons/GitHub'
import * as React from "react"
import "./style.scss"
import contentText from "../text/pt.json"
import { InfoDialog } from "../components/InfoDialog"
import { useState } from "react"

const useStyles = makeStyles(() => {
  return {
    icon: {
      marginRight: '1rem'
    }
  }
})
  
const IndexPage = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  return (
    <main>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
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
