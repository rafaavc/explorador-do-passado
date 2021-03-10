import { useEffect, useState } from 'react'
import { Message } from './utils/Message'
import { Container, Fade } from '@material-ui/core'
import { logEvent } from './utils/Logger'
import dev_data from './dev_data.json'
import { ArquivoData, PageMemento, PageTimestamp } from './utils/ArquivoData'
import { Header } from './components/Header'
import { Loading } from './components/Loading'
import { AppContent } from './components/AppContent'
import { arquivoDateToDate } from './utils/ArquivoDate'
import { queryCurrentTab } from './chrome/utils'
import { PageData, PageState, PageStateId } from './utils/Page'
import { SideBySideState } from './components/SideBySideState'

const getContentData = (setData: Function, setState: Function) => {
    const message: Message = { type: "get_page_data" }

    const messageResponseHandler = (pageData: PageData<PageTimestamp>) => {
        const arquivoData = pageData.arquivoData
        const mementoList = arquivoData.memento.list
        
        const validArquivoData: ArquivoData = {
            url: arquivoData.url,
            memento: {
                list: [],
                years: arquivoData.memento.years
            },
            article: arquivoData.article
        }

        for (const memento of mementoList) {
            const date = arquivoDateToDate(memento.timestamp)
            validArquivoData.memento.list.push({ date, timestamp: memento.timestamp })
        }

        setData(validArquivoData)
        setState(pageData.state)
        logEvent("Received data:", pageData)
    }

    queryCurrentTab()
        .then((tabId: number) => {
            // need to add timeout (if too long show error)
            const sendMessage = () => {
                chrome.tabs.sendMessage(tabId, message, (data: PageData<PageTimestamp>) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error!!", chrome.runtime.lastError.message)
                        setTimeout(sendMessage, 1000)
                    } else messageResponseHandler(data)
                })
            }
            sendMessage()
        })
}

const getDevData = (setData: Function) => {
    const validMementoList: PageMemento[] = []
    dev_data.memento.list.forEach((memento) => { validMementoList.push({ timestamp: memento.timestamp, date: arquivoDateToDate(memento.timestamp) }) })

    const validDevData: ArquivoData = {
        url: dev_data.url,
        article: dev_data.article,
        memento: {
            list: validMementoList,
            years: dev_data.memento.years
        }
    }

    setData(validDevData)
}


const App = () => {
    const [data, setData] = useState<ArquivoData|null>(null)
    const [state, setState] = useState<PageState|null>(null)

    useEffect(() => {
        if (process.env.NODE_ENV == "production") getContentData(setData, setState)
        else getDevData(setData)
    }, [])

    const pageContent = () => {
        if (data === null) return <Loading />
        else {
            let customComponent: JSX.Element | undefined = undefined;

            if (state != null && state.id == PageStateId.SHOWING_SIDE_BY_SIDE) customComponent = <SideBySideState timestamp={state.data}/>;
            
            return <AppContent data={data} customComponent={customComponent} />
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
    )
}

export default App