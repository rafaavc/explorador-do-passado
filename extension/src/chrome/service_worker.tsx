import { Message } from "../utils/Message"
import { PageInfo } from "./content"
import { ArquivoData, PageTimestamp, ArquivoMemento } from "../utils/ArquivoData"
import { logEvent, logReceived } from "../utils/Logger"
import { getYearFromTimestamp } from "../utils/ArquivoDate"


const processCDXReply = (textData: string): ArquivoMemento<PageTimestamp> => {
    const splitted = textData.split("\n")
    splitted.splice(splitted.length-1, 1) // last member is empty string
    const validJSON = `{ "data": [${splitted.join(",")}] }`
    const validData = JSON.parse(validJSON)

    const list: Array<{timestamp: string}> = []
    const years: number[] = []

    for (const memento of validData.data) {
        const timestamp = memento.timestamp
        list.push({ timestamp })

        const year = getYearFromTimestamp(timestamp)
        if (!years.includes(year)) years.push(year)
    }

    return { list, years }
}

const retrievePageData = (content: PageInfo) => new Promise<ArquivoData<PageTimestamp>>((resolve) => {
    const pyserverPromise = fetch(`${process.env.REACT_APP_SERVER_URL}/extension/api/page`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(content)
    })
        
    const cdxPromise = fetch(`https://arquivo.pt/wayback/cdx?url=${encodeURIComponent(content.url)}&output=json&fl=timestamp`)
    
    Promise.all([ pyserverPromise, cdxPromise ])
        .then((response: [ Response, Response ]) => Promise.all([ response[0].json(), response[1].text() ]))
        .then((data: [ any, string ]) => {
            const processedData: ArquivoData<PageTimestamp> = { 
                url: content.url,
                memento: processCDXReply(data[1]),
                article: data[0]
            }

            logEvent("Received memento and article data:", processedData)

            resolve(processedData)
        })
    })

chrome.runtime.onMessage.addListener((message: Message<PageInfo>, sender, sendResponse) => {
    logReceived(message, sender);
    if (message.type === "retrieve_page_data") {
        if (message.content != undefined) {
            retrievePageData(message.content)
                .then((data: ArquivoData<PageTimestamp>) => { sendResponse(data) })
        }
    }
    return true
})
