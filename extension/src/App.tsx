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


const App = () => {
    const [data, setData] = useState<ArquivoData|null>(null)

    useEffect(() => {
        if (process.env.NODE_ENV == "production") {
            const message: Message = { type: "get_page_data" }
            queryCurrentTab()
                .then((tabId: number) => {
                    // need to add timeout
                    chrome.tabs.sendMessage(tabId, message, (data: ArquivoData<PageTimestamp>) => {
                        const mementoList = data.memento.list
                        
                        const validData: ArquivoData = {
                            url: data.url,
                            memento: {
                                list: [],
                                years: data.memento.years
                            },
                            article: data.article
                        }
    
                        for (const memento of mementoList) {
                            const date = arquivoDateToDate(memento.timestamp)
                            validData.memento.list.push({ date, timestamp: memento.timestamp })
                        }
        
                        setData(validData)
                        logEvent("Received data:", data)
                    })
                })
            
        } else {
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
    }, [])

    const pageContent = () => {
        if (data === null) return <Loading />
        else return <AppContent data={data} />
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