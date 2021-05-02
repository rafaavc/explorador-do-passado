import { useEffect } from 'react'
import { Container, createMuiTheme, Fade, ThemeProvider } from '@material-ui/core'
import { ArquivoCDXData } from './utils/ArquivoInterfaces'
import { Header } from './components/Header'
import { Loading } from './components/Loading'
import { AppContent } from './components/AppContent'
import { Error } from './components/Error'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, selectArquivoCDXData, selectDataStatus } from './store/dataSlice'
import { fetchSettings, selectLanguageText, selectSettingsState } from './store/settingsSlice'
import { ThunkState } from './store/storeInterfaces'
import { ActionFeedback } from './components/ActionFeedback'
import { fetchHistory } from './store/historySlice'


const App = () => {
    const dispatch = useDispatch();

    const data: ArquivoCDXData | null = useSelector(selectArquivoCDXData);
    const dataState: ThunkState = useSelector(selectDataStatus);
    const settingsState: ThunkState = useSelector(selectSettingsState);
    const textContent = useSelector(selectLanguageText);

    useEffect(() => {
        dispatch(fetchData());
        dispatch(fetchSettings());
        dispatch(fetchHistory());
    }, []);

    const theme = createMuiTheme({
        palette: {
            type: 'light',
            text: {
                primary: 'rgba(0, 0, 0, 0.95)',
                secondary: 'rgba(0, 0, 0, 0.60)',
                disabled: 'rgba(0, 0, 0, 0.40)'
            }
        }
    });

    const pageContent = () => {
        if (dataState == ThunkState.Failed) return <Error msg={textContent.error.messages.retrieveData} />;
        else if (data === null || settingsState != ThunkState.Success) return <Loading />;
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