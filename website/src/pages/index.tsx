import { AppBar, Button, IconButton, Toolbar, Typography } from "@material-ui/core"
import MenuIcon from '@material-ui/icons/Menu';
import * as React from "react"
import "./style.scss"

// markup
const IndexPage = () => {
  return (
    <main>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" style={{ marginRight: "1rem" }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Arquivo Handbook
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </main>
  )
}

export default IndexPage
