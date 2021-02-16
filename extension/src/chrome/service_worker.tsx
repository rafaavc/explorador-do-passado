import { logEvent, logReceived } from "../utils/Logger";
import { Message } from "../utils/Message";

const LIFE_EXPECTANCY_MINS = 20
const REAPER_INTERVAL_SECS = 30

// TODO speed improvements by saving the current tab (by having a tabs.onActivated event listener)

interface TabData {
    id: number,
    timestamp: number,
    data: any
}

const tabs: Array<TabData> = []

chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker installed.")
});

const getCurrentTab = (callback: Function) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { callback(tabs[0]) })
}

/**
 * Returns the data associated with the tab. If an entry doesn't exist, returns undefined.
 * @param id the id of the tab as defined by the browser 
 */
const getTabData = (id: number): any => {
    const tab = tabs.find((td) => td.id === id)
    if (tab) {
        tab.timestamp = performance.now()  // update timestamp with the last time it was used
        return tab.data
    }
    return undefined
}

/**
 * Takes the tab id and data. If there is already an entry for that id, the entry's data is updated. 
 * If not, a new entry is created with the given id and data.
 * @param id the id of the tab as defined by the browser
 * @param data the data associated with the tab
 */
const addTabData = (id: number, data: any): void => {
    const tab = tabs.find((tab) => tab.id === id)
    if (tab) tab.data = data
    else tabs.push({ id: id, timestamp: performance.now(), data: data })
}

const clearCache = () => {
    const now = performance.now()
    for (let i = tabs.length - 1; i >= 0; i--) {
        const tabData = tabs[i]
        if (now - tabData.timestamp > LIFE_EXPECTANCY_MINS*1000*60) {
            tabs.splice(i, 1)
            logEvent(`Deleted cache of tab id '${tabData.id}', last time used was '${tabData.timestamp}' and current time is '${now}'.`)
        }
    }
}

setInterval(clearCache, REAPER_INTERVAL_SECS*1000)

const processTabContentData = (content: any, tabId: number, extender?: Function) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/extension/api`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(content)
    })
        .then((response: Response) => response.json())
        .then(data => {
            addTabData(tabId, data)
            if (extender) extender(data)
            logEvent("Received from API:", data)
        })
}

chrome.runtime.onMessage.addListener((message: Message, sender: chrome.runtime.MessageSender, sendResponse) => {
    
    if (message.type === "page_info") {
        if (sender.tab == undefined || sender.tab.id == undefined) {
            logEvent("Received 'page_info' message from invalid place.")
            return
        }
        processTabContentData(message.content, sender.tab.id)

        logReceived(message, sender)
        sendResponse("OK")

    } else if (message.type === "get_ui_data") {

        logReceived(message, sender, "Current tabs:", tabs)

        // check what is the active page and retrieve the info that corresponds to it
        // if none is found, request info from the content script
        getCurrentTab((tab: chrome.tabs.Tab) => {
            if (tab.id == undefined) {
                sendResponse("invalid_tab")
                return
            }
            const data = getTabData(tab.id)

            logEvent("get_ui_data:", tab, tab.id, data)

            if (data) {
                logEvent("sent data", data)
                sendResponse(data)
            }
            else {
                logEvent("going to get the data")
                chrome.tabs.sendMessage(tab.id, { type: "get_page_info" }, (message: any) => {
                    if (!tab.id) return
                    processTabContentData(message, tab.id, (processed: any) => { sendResponse(processed) })
                })
            }

        })

        return true    // keeps the port open until response is sent - VERY IMPORTANT!
    }
});

