import { Box, Button, Grid, Icon, makeStyles, Typography } from "@material-ui/core"
import { useGlobalHeadingStyles, useGlobalPaddingStyles } from "./GlobalStyles";
import React from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import publicoSideBySideShowcase from "../images/publico_sidebyside_showcase.gif";
import publicoTextDiffShowcase from "../images/publico_textdiff_showcase.gif";
import publicoHistoryShowcase from "../images/publico_history_showcase.gif";
import publicoSettingsShowcase from "../images/publico_settings_showcase.gif";
import installationImage from "../images/extensionWithExplorerDevTrueAnnotated.png";
import foundIcon from "../images/found512.png";
import notfoundIcon from "../images/notfound512.png";
import loadingIcon from "../images/loading512.png";

const useStyles = makeStyles((theme) => {
    return {
        logo: {
            width: '30vw',
            minWidth: '20rem',
            userSelect: 'none'
        },
        cover: {
            width: '100%',
            maxWidth: '70rem',
            marginTop: theme.spacing(3),
            userSelect: 'none'
        },
        center: {
            textAlign: 'center'
        },
        steps: {
            marginBottom: theme.spacing(2),
            '& li': {
                marginBottom: theme.spacing(2)
            },
            '& button': {
                marginTop: theme.spacing(1)
            }
        },
        stepsImage: {
            maxWidth: '55rem'
        },
        contentBox: {
            paddingBottom: '10rem'
        },
        iconGrid: {
            textAlign: 'center',
            marginTop: theme.spacing(3),
            '& img': {
                width: '100%',
                maxWidth: '5rem'
            }
        },
        settings: {
            maxWidth: '30rem'
        }
    }
})

export const IndexContent = () => {
    const globalPaddingClasses = useGlobalPaddingStyles();
    const globalHeadingClasses = useGlobalHeadingStyles();
    const classes = useStyles();
    return <>
        <Box mt={3} className={globalPaddingClasses.padding + " " + classes.contentBox}>
            <Typography variant="h5" className={globalHeadingClasses.heading}>
                Sobre o Explorador do Passado
            </Typography>
            <Typography variant="body1">
                O Explorador do Passado é uma extensão para browsers baseados em Chromium que permite encontrar e comparar versões mais antigas de páginas da web portuguesa. 
            </Typography>
            <Typography variant="body1">                
                Permite pesquisar estas versões (mementos) a partir da página atual e compará-las em vista lado a lado ou de diferenças de texto, entre outras ações e funcionalidades.
            </Typography>
            <Typography variant="h6" className={globalHeadingClasses.heading}>
                Instalação
            </Typography>
            <Typography variant="body1" className={classes.steps}>     
                <ol>
                    <li>
                        Fazer o download da extensão e extrair o conteúdo do ficheiro com extensão ".zip" no diretório desejado<br/>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<GetAppIcon />}
                            onClick={() => window.open("https://github.com/rafaavc/explorador-do-passado/releases/download/v1.0/explorador-do-passado-v1.0.zip", "_blank")}
                        >
                            Download
                        </Button>
                    </li>
                    <li>Navegar até à página de extensões do navegador (pode, em princípio, ser acedida através da inserção de "chrome://extensions" na barra de pesquisa)</li>
                    <li>Ativar o modo de programador</li>
                    <li>Clicar em "Carregar expandida" e procurar e selecionar a pasta "explorador-do-passado" (que foi extraída no passo 1)</li>
                </ol>
                Após a execução destes passos a extensão deve estar instalada no navegador.
            </Typography>
            <img src={installationImage} className={classes.cover + " " + classes.stepsImage} />

            <Typography variant="h5" className={globalHeadingClasses.heading}>
                Ações do memento
            </Typography>
            <Typography variant="body1">
                Após encontrar um memento existem quatro opções:
                <ul>
                    <li>Abrir em vista lado a lado (com a página atual)</li>
                    <li>Abrir em vista de diferenças de testo (com a página atual)</li>
                    <li>Abrir num novo separador</li>
                    <li>Copiar o seu URL</li>
                </ul>
            </Typography>

            <Typography variant="h6" className={globalHeadingClasses.heading}>
                Vista lado a lado
            </Typography>
            <Typography variant="body1">
                A vista lado a lado permite comparar visualmente o memento com a página atual.
            </Typography>
            <Typography variant="body1">
                A vista lado a lado apresenta também um cartão flutuante no canto inferior direito que permite executar todas as outras ações possíveis do memento, bem como fechar a sua visualização, sem precisar de abrir a extensão.
            </Typography>
            <img src={publicoSideBySideShowcase} className={classes.cover} />

            <Typography variant="h6" className={globalHeadingClasses.heading}>
                Vista de diferenças de texto
            </Typography>
            <Typography variant="body1">
                A vista de diferenças de texto permite comparar ver que alterações foram efetuadas ao texto desde o memento.
            </Typography>
            <Typography variant="body1">
                A vista de diferenças de texto apresenta também um cartão flutuante no canto inferior direito que permite executar todas as outras ações possíveis do memento, bem como fechar a sua visualização, sem precisar de abrir a extensão.
            </Typography>
            <img src={publicoTextDiffShowcase} className={classes.cover} />

            <Typography variant="h5" className={globalHeadingClasses.heading}>
                Histórico
            </Typography>
            <Typography variant="body1">
                O histórico permite revisitar mementos.
            </Typography>
            <img src={publicoHistoryShowcase} className={classes.cover} />

            <Typography variant="h5" className={globalHeadingClasses.heading}>
                Definições
            </Typography>
            <Typography variant="body1">
                Nas definições podem-se alterar os seguintes parâmetros:
                <ul>
                    <li>Linguagem: Português ou Inglês</li>
                    <li>Número máximo de entradas no histórico</li>
                    <li>Obter informação ao carregar página: se estiver ativa, sempre que uma página é visitada a extensão carrega imediatamente a informação sobre a mesma; se não estiver ativa esse carregamento acontece apenas quando a extensão for aberta.</li>
                </ul>
            </Typography>
            <img src={publicoSettingsShowcase} className={classes.cover + " " + classes.settings} />

            <Typography variant="h5" className={globalHeadingClasses.heading}>
                Estados do ícone da extensão
            </Typography>
            <Typography variant="body1">
                O ícone da extensão pode apresentar os seguintes estados:
            </Typography>
            <Grid container className={classes.iconGrid} spacing={5}>
                <Grid item sm={12} md={4}>
                    <img src={loadingIcon} />
                    <Typography variant="h6">
                        A carregar
                    </Typography>
                    <Typography variant="body1">
                        A extensão encontra-se no processo de obter informação sobre a página atual.
                    </Typography>
                </Grid>
                <Grid item sm={12} md={4}>
                    <img src={notfoundIcon} />
                    <Typography variant="h6">
                        Nenhum memento encontrado
                    </Typography>
                    <Typography variant="body1">
                        A extensão terminou o processo de obtenção de informação mas não encontrou versões antigas da página atual.
                    </Typography>                    
                </Grid>
                <Grid item sm={12} md={4}>
                    <img src={foundIcon} />
                    <Typography variant="h6">
                        Mementos disponíveis
                    </Typography>
                    <Typography variant="body1">
                        A extensão terminou o processo de obtenção de informação e encontrou versões antigas da página atual.
                    </Typography>                    
                </Grid>
            </Grid>


        </Box>
    </>
}