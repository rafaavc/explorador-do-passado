import { Dispatch } from "react"
import { queryCurrentTab } from "../chrome/utils"
import { updateState } from "../store/dataSlice"
import { Message } from "./Message"
import { PageStateId } from "./Page"
import { getMementoURL } from "./URL"
import { ArquivoArticle } from "./ArquivoData"
import { setFeedbackMessageAndOpen } from "../store/feedbackSlice"
import contentText from "../text/en.json"
import { copyToClipboard } from "./Clipboard"

export const openSideBySide = (url: string | undefined, timestamp: string, current: ArquivoArticle | undefined, dispatch: Dispatch<any>) => {
    if (process.env.NODE_ENV == "production") {
        if (current == undefined) {
            console.error("Received null arquivo article in 'openTextDiff'");
            return;
        } else if (url == undefined) {
            console.error("Received null url in 'openTextDiff'");
            return;
        }
        
        const message: Message = { type: "view_side_by_side", content: { url: getMementoURL(url, timestamp), timestamp, currentText: current.text } };
        queryCurrentTab().then((tabId: number) => {
            chrome.tabs.sendMessage(tabId, message);
        });
    } else {
        console.log(`Opened ${timestamp} side by side.`);
    }

    setTimeout(() => window.scrollTo(0, 0), 500);

    dispatch(updateState({ id: PageStateId.SHOWING_SIDE_BY_SIDE, data: timestamp }));
    dispatch(setFeedbackMessageAndOpen(contentText.mementoList.entryActions.sideBySide.successMsg));
}

export const openTextDiff = (url: string | undefined, timestamp: string, current: ArquivoArticle | undefined, dispatch: Dispatch<any>) => {
    if (process.env.NODE_ENV == "production") {
        if (current == undefined) {
            console.error("Received null arquivo article in 'openTextDiff'");
            return;
        } else if (url == undefined) {
            console.error("Received null url in 'openTextDiff'");
            return;
        }

        const message: Message = { type: "view_text_diff", content: { url: getMementoURL(url, timestamp), timestamp, currentText: current.text } };
        queryCurrentTab().then((tabId: number) => {
            chrome.tabs.sendMessage(tabId, message);
        });
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


export const copyMementoURLToClipboard = (url: string | undefined, timestamp: string, dispatch: Dispatch<any>) => {
    if (url == undefined) {
        console.error("Received null url in 'copyMementoURLToClipboard'");
        return;
    }
    copyToClipboard(getMementoURL(url, timestamp));
    dispatch(setFeedbackMessageAndOpen(contentText.mementoList.entryActions.copy.successMsg));
}


