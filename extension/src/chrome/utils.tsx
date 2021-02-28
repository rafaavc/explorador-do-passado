import { logEvent } from '../utils/Logger'

const queryCurrentTab = (callback: Function) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { 
        console.log("TABS:", tabs)
        if (tabs[0].id) callback(tabs[0].id) 
        else logEvent("Tried to query for active tab but received tab without id. Tabs:", tabs)
    })
}

export { queryCurrentTab }