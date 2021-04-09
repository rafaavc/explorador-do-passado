import { useEffect } from 'react'
import { Container, createMuiTheme, Fade, ThemeProvider } from '@material-ui/core'
import { ArquivoData } from './utils/ArquivoData'
import { Header } from './components/Header'
import { Loading } from './components/Loading'
import { AppContent } from './components/AppContent'
import { PageState } from './utils/Page'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, selectArquivoData, selectPageState } from './store/dataSlice'
import { fetchSettings, selectSettingsState } from './store/settingsSlice'
import { ThunkState } from './store/storeInterfaces'
import { ActionFeedback } from './components/ActionFeedback'


const App = () => {
    const dispatch = useDispatch();

    const data: ArquivoData|null = useSelector(selectArquivoData);
    const settingsState: ThunkState = useSelector(selectSettingsState);

    useEffect(() => {
        dispatch(fetchData());
        dispatch(fetchSettings());
    }, []);

    const theme = createMuiTheme({
        palette: {
            type: 'light',
            text: {
                primary: 'rgba(0, 0, 0, 0.95)',
                secondary: 'rgba(0, 0, 0, 0.70)',
                disabled: 'rgba(0, 0, 0, 0.40)'
            }
        }
    });

    const pageContent = () => {
        if (data === null || settingsState != ThunkState.Success) return <Loading />;
        return <AppContent data={data} />;
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <Header />
                <div id="ah-content-wrapper">
                    <Container>
                        <Fade in={true}>
                            {pageContent()}
                        </Fade>
                    </Container>
                </div>
                <ActionFeedback />
            </ThemeProvider>
        </>
    );
}

export default App;