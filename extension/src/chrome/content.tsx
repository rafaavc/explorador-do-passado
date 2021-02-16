import { abort } from "process";
import { logReceived, logResponse, logSent } from "../utils/Logger";
import { Message } from "../utils/Message";

if (window.location.href.includes('chrome-extension://')) {
    abort();
}

const pageInfoMessage: Message = {
    type: "page_info",
    content: {
        url: window.location.href,
        html: '<html><head>' + document.head.innerHTML + '</head><body>' + document.body.innerHTML + '</body></html>'
    }
};

const sendPageInfo = () => {
    chrome.runtime.sendMessage(pageInfoMessage, (response) => {
        logResponse(response)
    });
    logSent(pageInfoMessage)
}

sendPageInfo()

chrome.runtime.onMessage.addListener((message: Message, sender: chrome.runtime.MessageSender, sendResponse) => {
    if (message.type === "get_page_info") {
        logReceived(message, sender)
        sendPageInfo()
    }
});
