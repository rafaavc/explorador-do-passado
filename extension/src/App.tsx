import { useEffect, useState } from 'react'
import { Message } from './utils/Message'
import { Container, Fade } from '@material-ui/core'
import { logEvent } from './utils/Logger'
import dev_data from './dev_data.json'
import { ArquivoArticle, ArquivoData, PageMemento } from './utils/ArquivoData'
import { Header } from './components/Header'
import { Loading } from './components/Loading'
import { AppContent } from './components/AppContent'
import { arquivoDateToDate } from './utils/ArquivoDate'


const App = () => {
    const [data, setData] = useState<ArquivoData|null>(null)

    useEffect(() => {
        if (process.env.NODE_ENV == "production") {
            const message: Message = { type: "get_ui_data" }
            chrome.runtime.sendMessage(message, (data: { article: ArquivoArticle, url: string, memento: Array<{timestamp: string}> }) => {
                const mementoList = data.memento
                
                const validData: ArquivoData = {
                    url: data.url,
                    memento: {
                        list: [],
                        years: []
                    },
                    article: data.article
                }

                let previousYear = -1
                for (const memento of mementoList) {
                    if (validData.memento) {
                        const date = arquivoDateToDate(memento.timestamp)
                        validData.memento.list.push({ timestamp: date })
                        if (date.getFullYear() != previousYear) {
                            validData.memento.years.push(date.getFullYear())
                            previousYear = date.getFullYear()
                        }
                    }
                }

                setData(validData)
                logEvent("Received data:", data)
            })
        } else {
            const validMementoList: PageMemento[] = []
            dev_data.memento.list.forEach((memento) => { validMementoList.push({ timestamp: arquivoDateToDate(memento.timestamp) }) })

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