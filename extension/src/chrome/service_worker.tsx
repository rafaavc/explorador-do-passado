import { ArquivoData, ArquivoMemento } from "../utils/ArquivoData";
import { arquivoDateToDate } from "../utils/ArquivoDate";
import { logEvent, logReceived } from "../utils/Logger";
import { Message } from "../utils/Message";
import { PageInfo } from "./content";

const LIFE_EXPECTANCY_MINS = 20
const REAPER_INTERVAL_SECS = 30

interface TabData {
    id: number,
    timestamp: number,
    data: any
}

const tabs: Array<TabData> = []

chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker installed.")
});

let currentTabId: number = -1


let counter: number = 0

const logAndUpdateCounter = () => { counter++; logEvent("Testing:", counter)}

const getCurrentTab = (callback: Function) => {
    if (currentTabId === -1) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { 
            if (tabs[0].id) callback(tabs[0].id) 
            else logEvent("Tried to query for active tab but received tab without id. Tabs:", tabs)
        })
    } else callback(currentTabId)
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

const removeTabData = (id: number) => {
    const tab = tabs.find((tab) => tab.id === id)
    if (!tab) return
    tabs.splice(tabs.indexOf(tab), 1)
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

chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
    if (changeInfo.url) removeTabData(tabId)    // if the url has changed, forget what was stored
})

chrome.tabs.onActivated.addListener((activeInfo: chrome.tabs.TabActiveInfo) => {
    currentTabId = activeInfo.tabId    // keep track of the current tab so that there's no need to constantly query the tabs
                                       // this makes it very fast to retrieve the data related to the tab
})

const processTabContentData = (content: PageInfo, tabId: number, extender?: Function) => {
    let flag = false    // neither have finished
    let processedData: ArquivoData = { url: content.url }

    const compileData = (data: any, source: "pyserver" | "memento") => {
        if (source === "memento") processedData.memento = data
        else if (source === "pyserver") processedData.article = data
        
        if (flag === false) flag = true
        else {
            addTabData(tabId, processedData)
            if (extender) extender(processedData)
        }
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/extension/api`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(content)
    })
        .then((response: Response) => response.json())
        .then(data => {
            compileData(data, "pyserver")
            logEvent("Received from pyserver:", data)
        })

    fetch(`https://arquivo.pt/wayback/cdx?url=${encodeURIComponent(content.url)}&output=json&fl=timestamp`)
        .then((response: Response) => response.text())
        .then(textData => {
            const splitted = textData.split("\n")
            splitted.splice(splitted.length-1, 1) // last member is empty string
            const validJSON = `{ "data": [${splitted.join(",")}] }`
            const validData = JSON.parse(validJSON)

            const finalData: Array<{timestamp: string}> = []

            validData.data.forEach((memento: { timestamp: string }) => finalData.push({ timestamp: memento.timestamp }))

            compileData(finalData, "memento")
            logEvent("Received from memento:", finalData)
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
        logAndUpdateCounter()

        logReceived(message, sender, "Current tabs:", tabs)

        // check what is the active page and retrieve the info that corresponds to it
        // if none is found, request info from the content script
        getCurrentTab((tabId: number) => {
            const data = getTabData(tabId)

            if (data) {
                logEvent("sent data", data)
                sendResponse(data)
            } else {
                // need to make something for when the data is requested while the page is still loading
                // need to delete tab info on tab close
                logEvent("going to get the data")
                chrome.tabs.sendMessage(tabId, { type: "get_page_info" }, (message: PageInfo) => {
                    processTabContentData(message, tabId, (processed: any) => { sendResponse(processed) })
                })
            }

        })

        return true    // keeps the port open until response is sent - VERY IMPORTANT!
    }
});

