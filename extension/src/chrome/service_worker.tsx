import { logReceived } from "../utils/Logger";
import { Message } from "../utils/Message";


chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker installed.")
});

let currentUIData: any = null;

chrome.runtime.onMessage.addListener((message: Message, sender: chrome.runtime.MessageSender, sendResponse) => {
    logReceived(message, sender)
    if (message.type === "page_info") {
        currentUIData = null
        fetch(`${process.env.REACT_APP_SERVER_URL}/extension/api`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(message.content)
        })
            .then((response: Response) => response.json())
            .then(data => {
                currentUIData = data
                console.log("Received from API:", data)
            })
        sendResponse("OK")
    } else if (message.type === "get_ui_data") {
        sendResponse(currentUIData)
    }
});

