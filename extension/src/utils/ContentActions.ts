import { Dispatch } from "react"
import { queryCurrentTab } from "../chrome/utils"
import { updateState } from "../store/dataSlice"
import { Message } from "./Message"
import { PageStateId } from "./Page"
import { getMementoURL, openURL } from "./URL"
import { ArquivoArticle, MementoHistoryEntry } from "./ArquivoInterfaces"
import { setFeedbackMessageAndOpen } from "../store/feedbackSlice"
import { copyToClipboard } from "./Clipboard"
import { addToHistory } from "../store/historySlice"
import { PopupLanguage } from "../text/PopupLanguage"

const createMementoHistoryEntry = (title: string, url: string, mementoTimestamp: string): MementoHistoryEntry => {
    return {
        url,
        mementoTimestamp,
        title,
        viewedTimestamp: Date.now()
    }
}

export const openSideBySide = (contentText: PopupLanguage, current: MementoHistoryEntry[], maxHistoryEntries: number, url: string | undefined, timestamp: string, title: string, dispatch: Dispatch<any>) => {
    if (process.env.NODE_ENV == "production") {
        if (url == undefined) {
            console.error("Received null url in 'openTextDiff'");
            return;
        }
        
        const message: Message = { type: "view_side_by_side", content: { url: getMementoURL(url, timestamp), timestamp } };
        queryCurrentTab().then((tabId: number) => {
            chrome.tabs.sendMessage(tabId, message);
        });

        dispatch(addToHistory({ current, added: createMementoHistoryEntry(title, url, timestamp), maxHistoryEntries }));
    } else {
        console.log(`Opened ${timestamp} side by side.`);
    }

    setTimeout(() => window.scrollTo(0, 0), 500);

    dispatch(updateState({ id: PageStateId.SHOWING_SIDE_BY_SIDE, data: timestamp }));
    dispatch(setFeedbackMessageAndOpen(contentText.mementoList.entryActions.sideBySide.successMsg));
}

export const openTextDiff = (contentText: PopupLanguage, current: MementoHistoryEntry[], maxHistoryEntries: number, url: string | undefined, timestamp: string, title: string, dispatch: Dispatch<any>) => {
    if (process.env.NODE_ENV == "production") {
        if (url == undefined) {
            console.error("Received null url in 'openTextDiff'");
            return;
        }

        const message: Message = { type: "view_text_diff", content: { url: getMementoURL(url, timestamp), timestamp } };
        queryCurrentTab().then((tabId: number) => {
            chrome.tabs.sendMessage(tabId, message);
        });

        dispatch(addToHistory({ current, added: createMementoHistoryEntry(title, url, timestamp), maxHistoryEntries }));
    } else {
        console.log(`Opened ${timestamp} text diff.`);
    }

    setTimeout(() => window.scrollTo(0, 0), 500);

    dispatch(updateState({ id: PageStateId.SHOWING_TEXT_DIFF, data: timestamp }));
    dispatch(setFeedbackMessageAndOpen(contentText.mementoList.entryActions.textDiff.successMsg));
}


export const closeMementoViewing = (contentText: PopupLanguage, dispatch: Dispatch<any>) => {
    if (process.env.NODE_ENV == "production") {
        const message: Message = { type: "close_viewing" };
        queryCurrentTab().then((tabId: number) => {
            chrome.tabs.sendMessage(tabId, message);
        });
    } else {
        console.log('Closed memento viewing.');
    }

    dispatch(updateState({ id: PageStateId.START, data: null }));
    dispatch(setFeedbackMessageAndOpen(contentText.mementoList.viewingMementoCard.closeFeedback.success));
}

export const openMemento = (current: MementoHistoryEntry[], maxHistoryEntries: number, title: string, url: string | undefined, timestamp: string, dispatch: Dispatch<any>): void => {
    if (url == undefined) return;

    openURL(getMementoURL(url, timestamp));

    if (process.env.NODE_ENV == "production") dispatch(addToHistory({ current, added: createMementoHistoryEntry(title, url, timestamp), maxHistoryEntries }));
}


export const copyMementoURLToClipboard = (contentText: PopupLanguage, current: MementoHistoryEntry[], maxHistoryEntries: number, title: string, url: string | undefined, timestamp: string, dispatch: Dispatch<any>) => {
    if (url == undefined) {
        console.error("Received null url in 'copyMementoURLToClipboard'");
        return;
    }

    copyToClipboard(getMementoURL(url, timestamp));
    dispatch(setFeedbackMessageAndOpen(contentText.mementoList.entryActions.copy.successMsg));

    if (process.env.NODE_ENV == "production") dispatch(addToHistory({ current, added: createMementoHistoryEntry(title, url, timestamp), maxHistoryEntries }));
}


