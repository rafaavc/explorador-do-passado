import { useEffect } from 'react'
import { Container, Fade } from '@material-ui/core'
import { ArquivoData } from './utils/ArquivoData'
import { Header } from './components/Header'
import { Loading } from './components/Loading'
import { AppContent } from './components/AppContent'
import { PageState, PageStateId } from './utils/Page'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, selectArquivoData, selectPageState } from './store/dataSlice'
import { MementoViewingCard } from './components/MementoViewingCard'
import { fetchSettings, selectSettingsState } from './store/settingsSlice'
import { ThunkState } from './store/storeInterfaces'


const App = () => {
    const dispatch = useDispatch();

    const data: ArquivoData|null = useSelector(selectArquivoData);
    const state: PageState = useSelector(selectPageState);
    const settingsState: ThunkState = useSelector(selectSettingsState);

    useEffect(() => {
        dispatch(fetchData());
        dispatch(fetchSettings());
    }, []);

    const pageContent = () => {
        if (data === null || settingsState != ThunkState.Success) return <Loading />;
        else {
            let customComponent: JSX.Element | undefined = undefined;

            if (state.id != PageStateId.START) customComponent = <MementoViewingCard timestamp={state.data} />;
            
            return <AppContent data={data} customComponent={customComponent} />;
        }
    }

    return (
        <>
            <Header />
            <div id="ah-content-wrapper">
                <Container>
                    <Fade in={true}>
                        {pageContent()}
                    </Fade>
                </Container>
            </div>
        </>
    );
}

export default App;