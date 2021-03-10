import { queryCurrentTab } from "../chrome/utils"
import { Message } from "./Message"
import { getMementoURL } from "./URL"

export const openSideBySide = (url: string, timestamp: string) => {
    const message: Message = { type: "view_side_by_side", content: { url: getMementoURL(url, timestamp), timestamp } }
    queryCurrentTab().then((tabId: number) => {
        chrome.tabs.sendMessage(tabId, message)
    })
}


export const closeSideBySide = () => {
    const message: Message = { type: "close_viewing" }
    queryCurrentTab().then((tabId: number) => {
        chrome.tabs.sendMessage(tabId, message)
    })
}




