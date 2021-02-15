import { logReceived } from "../utils/Logger";
import { Message } from "../utils/Message";


chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker installed.")
});

let currentUIData: any = null;

chrome.runtime.onMessage.addListener((message: Message, sender: chrome.runtime.MessageSender, sendResponse) => {
    logReceived(message, sender)
    if (message.type === "page_info") {
        
        // TODO
        // save a buffer of tabs that saves the data for each tab
        // each of the entries has the time it was last used
        // if too long passes since that time, the entry is deleted

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

        // TODO
        // check what is the active page and retrieve the info that corresponds to it
        // if none is found, request info from the content script and send a message to the ui

        sendResponse(currentUIData)
    }
});

