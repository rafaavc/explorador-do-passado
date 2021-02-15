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

chrome.runtime.sendMessage(pageInfoMessage, (response) => {
    logResponse(response)
});
logSent(pageInfoMessage)

// chrome.runtime.onMessage.addListener((message: Message, sender: chrome.runtime.MessageSender, sendResponse) => {
//     logReceived(message, sender)
// });
