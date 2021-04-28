import { AppBar, Tooltip, IconButton, Toolbar, Typography, Link, makeStyles } from "@material-ui/core"
import InfoIcon from '@material-ui/icons/Info'
import GitHubIcon from '@material-ui/icons/GitHub'
import * as React from "react"
import "./style.scss"
import contentText from "../text/pt.json"

const useStyles = makeStyles(() => {
  return {
    icon: {
      marginRight: '1rem'
    }
  }
})
  
const IndexPage = () => {
  const classes = useStyles();
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
              <IconButton edge="start" color="inherit" onClick={() => console.log("Open info")} aria-label="menu">
                  <InfoIcon />
              </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </main>
  )
}

export default IndexPage
