import { Dispatch } from "react"
import { queryCurrentTab } from "../chrome/utils"
import { updateState } from "../store/dataSlice"
import { Message } from "./Message"
import { PageStateId } from "./Page"
import { getMementoURL, openURL } from "./URL"
import { ArquivoArticle, MementoHistoryEntry } from "./ArquivoData"
import { setFeedbackMessageAndOpen } from "../store/feedbackSlice"
import contentText from "../text/en.json"
import { copyToClipboard } from "./Clipboard"
import { addToHistory } from "../store/historySlice"

const createMementoHistoryEntry = (article: ArquivoArticle, url: string, mementoTimestamp: string): MementoHistoryEntry => {
    return {
        url,
        mementoTimestamp,
        title: article.title,
        viewedTimestamp: Date.now()
    }
}

export const openSideBySide = (current: MementoHistoryEntry[], url: string | undefined, timestamp: string, article: ArquivoArticle | undefined, dispatch: Dispatch<any>) => {
    if (process.env.NODE_ENV == "production") {
        if (article == undefined) {
            console.error("Received null arquivo article in 'openTextDiff'");
            return;
        } else if (url == undefined) {
            console.error("Received null url in 'openTextDiff'");
            return;
        }
        
        const message: Message = { type: "view_side_by_side", content: { url: getMementoURL(url, timestamp), timestamp, currentText: article.text } };
        queryCurrentTab().then((tabId: number) => {
            chrome.tabs.sendMessage(tabId, message);
        });

        dispatch(addToHistory({ current, added: createMementoHistoryEntry(article, url, timestamp) }));
    } else {
        console.log(`Opened ${timestamp} side by side.`);
    }

    setTimeout(() => window.scrollTo(0, 0), 500);

    dispatch(updateState({ id: PageStateId.SHOWING_SIDE_BY_SIDE, data: timestamp }));
    dispatch(setFeedbackMessageAndOpen(contentText.mementoList.entryActions.sideBySide.successMsg));
}

export const openTextDiff = (current: MementoHistoryEntry[], url: string | undefined, timestamp: string, article: ArquivoArticle | undefined, dispatch: Dispatch<any>) => {
    if (process.env.NODE_ENV == "production") {
        if (article == undefined) {
            console.error("Received null arquivo article in 'openTextDiff'");
            return;
        } else if (url == undefined) {
            console.error("Received null url in 'openTextDiff'");
            return;
        }

        const message: Message = { type: "view_text_diff", content: { url: getMementoURL(url, timestamp), timestamp, currentText: article.text } };
        queryCurrentTab().then((tabId: number) => {
            chrome.tabs.sendMessage(tabId, message);
        });

        dispatch(addToHistory({ current, added: createMementoHistoryEntry(article, url, timestamp) }));
    } else {
        console.log(`Opened ${timestamp} text diff.`);
    }

    setTimeout(() => window.scrollTo(0, 0), 500);

    dispatch(updateState({ id: PageStateId.SHOWING_TEXT_DIFF, data: timestamp }));
    dispatch(setFeedbackMessageAndOpen(contentText.mementoList.entryActions.textDiff.successMsg));
}


export const closeMementoViewing = (dispatch: Dispatch<any>) => {
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

export const openMemento = (current: MementoHistoryEntry[], article: ArquivoArticle | undefined, url: string | undefined, timestamp: string, dispatch: Dispatch<any>): void => {
    if (article == undefined || url == undefined) return;

    openURL(getMementoURL(url, timestamp));

    if (process.env.NODE_ENV == "production") dispatch(addToHistory({ current, added: createMementoHistoryEntry(article, url, timestamp) }));
}


export const copyMementoURLToClipboard = (current: MementoHistoryEntry[], article: ArquivoArticle | undefined, url: string | undefined, timestamp: string, dispatch: Dispatch<any>) => {
    if (article == undefined) {
        console.error("Received null arquivo article in 'copyMementoURLToClipboard'");
        return;
    }
    if (url == undefined) {
        console.error("Received null url in 'copyMementoURLToClipboard'");
        return;
    }

    copyToClipboard(getMementoURL(url, timestamp));
    dispatch(setFeedbackMessageAndOpen(contentText.mementoList.entryActions.copy.successMsg));

    if (process.env.NODE_ENV == "production") dispatch(addToHistory({ current, added: createMementoHistoryEntry(article, url, timestamp) }));
}


