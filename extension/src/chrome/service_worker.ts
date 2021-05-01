import { Message } from "../utils/Message"
import { PageInfo } from "../utils/Page"
import { ArquivoData, PageTimestamp, ArquivoMemento, ArquivoArticle } from "../utils/ArquivoData"
import { logEvent, logReceived } from "../utils/Logger"
import { getYearFromTimestamp } from "../utils/ArquivoDate"
import { foundIcon, loadingIcon, notFoundIcon } from "../utils/Icons"


const setIcon = (icon: {16: string, 48: string, 128: string}, tabId: number | undefined) => {
    chrome.action.setIcon({ path: icon, tabId });
}

setIcon(loadingIcon, undefined);


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

const retrievePageHTML = (url: string) => new Promise<string|null>((resolve, reject) => {
    fetch(url)
        .then((response: Response) => response.text())
        .then((text: string) => resolve(text))
        .catch(() => reject())
})

const retrievePageData = (content: PageInfo) => new Promise<ArquivoData<PageTimestamp>>(async (resolve, reject) => {
    if (content.html == undefined) {
         const html: string|null = await retrievePageHTML(content.url);
         if (html == null) reject();
         else content.html = html;
    }
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

const retrieveArquivoArticle = (content: { url: string, html?: string }) => new Promise<ArquivoArticle>(async (resolve, reject) => {
    if (content.html == undefined) {
        const html: string|null = await retrievePageHTML(content.url);
        if (html == null) {
            reject();
            return;
        }
        content.html = html;
    }

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
        .then((data: ArquivoArticle) => {
            console.log("Received data: " + data);
            resolve(data);
        })
        .catch((reason: any) => reject(reason))
});

chrome.runtime.onMessage.addListener((message: Message<PageInfo>, sender, sendResponse) => {
    logReceived(message, sender);
    if (message.type === "retrieve_page_data") {
        if (message.content != undefined) {
            setIcon(loadingIcon, sender.tab?.id);
            retrievePageData(message.content)
                .then((data: ArquivoData<PageTimestamp>) => { 
                    if (data.memento.list.length == 0) setIcon(notFoundIcon, sender.tab?.id);
                    else setIcon(foundIcon, sender.tab?.id);

                    sendResponse(data);
                })
                .catch(error => {
                    console.error(error);
                    setIcon(notFoundIcon, sender.tab?.id);
                })
        }
    } else if (message.type === "retrieve_arquivo_article") {
        if (message.content != undefined) {
            retrieveArquivoArticle(message.content)
                .then((data: ArquivoArticle) => { sendResponse(data) })
        }
    }
    return true
})
