import { abort } from "process";
import { logReceived, logResponse, logSent } from "../utils/Logger";
import { Message } from "../utils/Message";

if (window.location.href.includes('chrome-extension://')) abort();

interface PageInfo {
    url: string,
    html: string
};

const pageInfoMessage: Message<PageInfo> = {
    type: "page_info",
    content: {
        url: window.location.href,
        html: document.documentElement.outerHTML
    }
};

const sendPageInfo = () => {
    chrome.runtime.sendMessage(pageInfoMessage, (response) => {
        logResponse(response);
    });
    logSent(pageInfoMessage);
};


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

sendPageInfo();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    logReceived(message, sender);
    if (message.type === "get_page_info") {
        sendResponse(pageInfoMessage.content)
    } else if (message.type === "view_side_by_side") {
        openSideBySide(message.content.url)
    }
});

export type { PageInfo };
