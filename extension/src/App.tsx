import { useEffect } from 'react'
import { Container, Fade } from '@material-ui/core'
import { ArquivoData } from './utils/ArquivoData'
import { Header } from './components/Header'
import { Loading } from './components/Loading'
import { AppContent } from './components/AppContent'
import { PageState, PageStateId } from './utils/Page'
import { SideBySideState } from './components/SideBySideState'
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, selectArquivoData, selectPageState } from './store/dataSlice'


const App = () => {
    const dispatch = useDispatch();

    const data: ArquivoData|null = useSelector(selectArquivoData);
    const state: PageState = useSelector(selectPageState);

    useEffect(() => {
        dispatch(fetchData());
        // if (process.env.NODE_ENV == "production") getContentData(setData, setState)
        // else getDevData(setData)
    }, []);

    const pageContent = () => {
        if (data === null) return <Loading />;
        else {
            let customComponent: JSX.Element | undefined = undefined;

            if (state.id == PageStateId.SHOWING_SIDE_BY_SIDE) customComponent = <SideBySideState timestamp={state.data}/>;
            
            return <AppContent data={data} customComponent={customComponent} />;
        }
    }

    return (
        <>
            <Header />
            <Container>
                <Fade in={true}>
                    {pageContent()}
                </Fade>
            </Container>
        </>
    );
}

export default App;