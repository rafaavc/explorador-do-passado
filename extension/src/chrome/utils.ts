import { logEvent } from '../utils/Logger'

const queryCurrentTab = () => new Promise<number>((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { 
        console.log("TABS:", tabs)
        if (tabs[0].id) resolve(tabs[0].id) 
        else reject("Tried to query for active tab but received tab without id.")
    })
})

export { queryCurrentTab }