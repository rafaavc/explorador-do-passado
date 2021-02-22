import { DialogContentText, DialogContent, AppBar, Toolbar, Typography, Tooltip, IconButton, makeStyles, Dialog, DialogTitle } from '@material-ui/core'
import LanguageIcon from '@material-ui/icons/Language'
import TuneIcon from '@material-ui/icons/Tune'
import InfoIcon from '@material-ui/icons/Info';
import { useState } from 'react'

const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
    }
}))

interface InfoDialogProps {
    open: boolean,
    onCloseFn: any
}

function InfoDialog(props: InfoDialogProps) {
    const { open, onCloseFn } = props;
  
    return <Dialog onClose={onCloseFn} aria-labelledby="info-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Sobre o Arquivo Handbook</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Esta ferramenta foi desenvolvida com base na informação disponibilizada pelo serviço Arquivo.pt, que preserva as páginas web do passado.
                </DialogContentText>
            </DialogContent>
        </Dialog>
  }

const Header = () => {
    const classes = useStyles()

    const [ infoOpen, setInfoOpen ] = useState(false)

    return <>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.grow}>Arquivo Handbook</Typography>
                <Tooltip title="Website">
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <LanguageIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Informação">
                    <IconButton edge="start" color="inherit" onClick={() => setInfoOpen(true)} aria-label="menu">
                        <InfoIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Definições">
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <TuneIcon />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
        <InfoDialog open={infoOpen} onCloseFn={() => setInfoOpen(false)} />
    </>

}


export { Header }
