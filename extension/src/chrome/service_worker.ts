import { Message } from "../utils/Message"
import { PageInfo } from "../utils/Page"
import { ArquivoData, PageTimestamp, ArquivoMemento } from "../utils/ArquivoData"
import { logEvent, logReceived } from "../utils/Logger"
import { getYearFromTimestamp } from "../utils/ArquivoDate"
import { DiffPageData } from "../utils/Page"


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
        .then(([pyserver, cdx]: [ Response, Response ]) => Promise.all([ pyserver.json(), cdx.text() ]))
        .then(([pyserver, cdx]: [ any, string ]) => {
            const processedData: ArquivoData<PageTimestamp> = { 
                url: content.url,
                memento: processCDXReply(cdx),
                article: pyserver
            }

            logEvent("Received memento and article data:", processedData)

            resolve(processedData)
        })
    });

const retrieveDiffPageData = (content: { url: string }) => new Promise<DiffPageData>((resolve, reject) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/extension/api/page`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(content)
    })
        .then(async (response: Response) => {
            return response.json()
        })
        .then((data: DiffPageData) => {
            console.log("Received data: " + data);
            resolve(data);
        })
        .catch((reason: any) => reject(reason))
});

chrome.runtime.onMessage.addListener((message: Message<PageInfo>, sender, sendResponse) => {
    logReceived(message, sender);
    if (message.type === "retrieve_page_data") {
        if (message.content != undefined) {
            retrievePageData(message.content)
                .then((data: ArquivoData<PageTimestamp>) => { sendResponse(data) })
        }
    } else if (message.type === "retrieve_diff_page_data") {
        if (message.content != undefined) {
            retrieveDiffPageData(message.content)
                .then((data: DiffPageData) => { sendResponse(data) })
        }
    }
    return true
})
