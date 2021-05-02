import { Message } from "../utils/Message"
import { PageInfo } from "../utils/Page"
import { ArquivoCDXData, PageTimestamp, ArquivoMemento, ArquivoArticle } from "../utils/ArquivoInterfaces"
import { logEvent, logReceived } from "../utils/Logger"
import { getYearFromTimestamp } from "../utils/ArquivoDate"
import { foundIcon, loadingIcon, notFoundIcon } from "../utils/Icons"
import { retrieveArquivoArticleMessage, retrieveArquivoCDXDataMessage } from "./messages"


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

const retrievePageData = (content: PageInfo) => new Promise<ArquivoCDXData<PageTimestamp>>(async (resolve, reject) => {        
    fetch(`https://arquivo.pt/wayback/cdx?url=${encodeURIComponent(content.url)}&output=json&fl=timestamp`)
        .then((cdx: Response) => cdx.text())
        .then((cdx: string) => {
            const processedData: ArquivoCDXData<PageTimestamp> = { 
                url: content.url,
                memento: processCDXReply(cdx),
                title: content.title
            }

            logEvent("Received CDX data:", processedData);

            resolve(processedData);
        })
        .catch(error => reject(error));
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
    if (message.type === retrieveArquivoCDXDataMessage) {
        if (message.content != undefined) {
            setIcon(loadingIcon, sender.tab?.id);
            retrievePageData(message.content)
                .then((data: ArquivoCDXData<PageTimestamp>) => { 
                    if (data.memento.list.length == 0) setIcon(notFoundIcon, sender.tab?.id);
                    else setIcon(foundIcon, sender.tab?.id);

                    sendResponse(data);
                })
                .catch(error => {
                    console.error(error);
                    setIcon(notFoundIcon, sender.tab?.id);
                })
        }
    } else if (message.type === retrieveArquivoArticleMessage) {
        if (message.content != undefined) {
            retrieveArquivoArticle(message.content)
                .then((data: ArquivoArticle) => { sendResponse(data) })
        }
    }
    return true
})
