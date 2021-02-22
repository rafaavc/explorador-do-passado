import { useEffect, useState } from 'react'
import { Message } from './utils/Message'
import { Container, Fade } from '@material-ui/core'
import { logEvent } from './utils/Logger'
import dev_data from './dev_data.json'
import { ArquivoData } from './utils/ArquivoData'
import { Header } from './components/Header'
import { Loading } from './components/Loading'
import { AppContent } from './components/AppContent'


const App = () => {
    const [data, setData] = useState<ArquivoData|null>(null)

    useEffect(() => {
        if (process.env.NODE_ENV == "production") {
            const message: Message = { type: "get_ui_data" }
            chrome.runtime.sendMessage(message, (data: ArquivoData) => {
                setData(data)
                logEvent("Received data:", data)
            })
        } else setData(dev_data)
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