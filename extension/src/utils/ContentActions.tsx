import { Dispatch } from "react"
import { queryCurrentTab } from "../chrome/utils"
import { updateState } from "../store/dataSlice"
import { Message } from "./Message"
import { PageStateId } from "./Page"
import { getMementoURL } from "./URL"

export const openSideBySide = (url: string, timestamp: string, dispatch: Dispatch<any>) => {
    if (process.env.NODE_ENV == "production") {
        const message: Message = { type: "view_side_by_side", content: { url: getMementoURL(url, timestamp), timestamp } };
        queryCurrentTab().then((tabId: number) => {
            chrome.tabs.sendMessage(tabId, message);
        });
    } else {
        console.log(`Opened ${timestamp} side by side.`);
    }

    dispatch(updateState({ id: PageStateId.SHOWING_SIDE_BY_SIDE, data: timestamp }));
}


export const closeSideBySide = (dispatch: Dispatch<any>) => {
    if (process.env.NODE_ENV == "production") {
        const message: Message = { type: "close_viewing" };
        queryCurrentTab().then((tabId: number) => {
            chrome.tabs.sendMessage(tabId, message);
        });
    } else {
        console.log('Closed side by side viewing mode.');
    }

    dispatch(updateState({ id: PageStateId.START, data: null }));
}




