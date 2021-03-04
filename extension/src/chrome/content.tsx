import { abort } from "process";
import { ArquivoData, ArquivoMemento, PageTimestamp } from "../utils/ArquivoData";
import { getYearFromTimestamp } from "../utils/ArquivoDate";
import { logEvent, logReceived } from "../utils/Logger";
import { Message } from "../utils/Message";
import { PageData, PageInfo, PageState, PageStateId } from "../utils/Page";
import { SettingsOptions } from "../utils/SettingsOptions";
import { getSettingsValue, Dict } from "./Storage";

if (window.location.href.includes('chrome-extension://')) abort();


const pageInfo: PageInfo = {
    url: window.location.href,
    html: document.documentElement.outerHTML
}

let arquivoData: ArquivoData<PageTimestamp> | null = null
let pageState: PageState = {
    id: PageStateId.START,
    data: null
}

let retrievingPageData: boolean = false

const openSideBySide = (url: string) => {
    const iframe1 = document.createElement('iframe')
    iframe1.srcdoc = document.documentElement.outerHTML
    iframe1.style.width = "50%"
    iframe1.style.position = "absolute"
    iframe1.style.left = "0"
    iframe1.style.height = window.innerHeight + "px"
    iframe1.style.border = 'none'
    const iframe2 = document.createElement('iframe')
    iframe2.src = url
    iframe2.style.width = "50%"
    iframe2.style.position = "absolute"
    iframe2.style.left = "50%"
    iframe2.style.height = window.innerHeight + "px"
    iframe2.style.border = 'none'

    const newDoc = document.createElement('html')
    const head = document.createElement('head')
    const title = document.createElement('title')
    title.innerText = "Side by Side"
    head.appendChild(title)
    newDoc.appendChild(head)
    const body = document.createElement('body')
    body.style.margin = '0'
    body.appendChild(iframe1)
    body.appendChild(iframe2)
    newDoc.appendChild(body)

    document.documentElement.innerHTML = newDoc.innerHTML
}

const retrieveArquivoData = (pageInfo: PageInfo) => new Promise<ArquivoData<PageTimestamp>>((resolve) => {
    retrievingPageData = true
    chrome.runtime.sendMessage({ type: "retrieve_page_data", content: pageInfo }, (data: ArquivoData<PageTimestamp>) => { 
        arquivoData = data
        retrievingPageData = false
        resolve(data) 
    })
})

getSettingsValue(SettingsOptions.RetrieveAtLoad, (res: Dict) => {
    console.log("Received the value of " + SettingsOptions.RetrieveAtLoad + ":", res)
    const value = SettingsOptions.RetrieveAtLoad in res ? res[SettingsOptions.RetrieveAtLoad] : true
    if (value === true) retrieveArquivoData(pageInfo)
})

const buildPageData = (arquivoData: ArquivoData<PageTimestamp>): PageData<PageTimestamp> => {
    return {
        arquivoData,
        state: pageState
    }
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    logReceived(message, sender);
    if (message.type === "get_page_data") {
        if (arquivoData) sendResponse(buildPageData(arquivoData))
        else if (!retrievingPageData) {
            retrieveArquivoData(pageInfo)
                .then((arquivoData: ArquivoData<PageTimestamp>) => { sendResponse(buildPageData(arquivoData)) })
        }
    } else if (message.type === "view_side_by_side") {
        pageState.id = PageStateId.SHOWING_SIDE_BY_SIDE
        pageState.data = message.content.timestamp
        openSideBySide(message.content.url)
    }
    return true
});

export type { PageInfo };
