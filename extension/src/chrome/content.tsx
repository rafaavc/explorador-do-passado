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

sendPageInfo();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    logReceived(message, sender);
    if (message.type === "get_page_info") {
        sendResponse(pageInfoMessage.content);
    }
});

export type { PageInfo };
