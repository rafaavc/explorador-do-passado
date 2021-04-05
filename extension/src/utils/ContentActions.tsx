import { Dispatch } from "react"
import { queryCurrentTab } from "../chrome/utils"
import { updateState } from "../store/dataSlice"
import { Message } from "./Message"
import { PageStateId } from "./Page"
import { getMementoURL } from "./URL"
import { DiffPageData } from "../utils/Page"
import { ArquivoArticle } from "./ArquivoData"

const Diff = require('text-diff');

export const openSideBySide = (url: string, timestamp: string, dispatch: Dispatch<any>) => {
    if (process.env.NODE_ENV == "production") {
        const message: Message = { type: "view_side_by_side", content: { url: getMementoURL(url, timestamp), timestamp } };
        queryCurrentTab().then((tabId: number) => {
            chrome.tabs.sendMessage(tabId, message);
        });
    } else {
        console.log(`Opened ${timestamp} side by side.`);
    }

    setTimeout(() => window.scrollTo(0, 0), 500);

    dispatch(updateState({ id: PageStateId.SHOWING_SIDE_BY_SIDE, data: timestamp }));
}


const retrieveDiffPageData = (url: string) => new Promise<DiffPageData>((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "retrieve_diff_page_data", content: { url } }, (response: DiffPageData) => {
        resolve(response);
    });
});

export const openTextDiff = async (url: string, timestamp: string, current: ArquivoArticle | undefined, dispatch: Dispatch<any>) => {
    if (process.env.NODE_ENV == "production") {
        if (current == undefined) {
            console.error("Received null arquivo article in 'openTextDiff'");
            return;
        }

        const data: DiffPageData = await retrieveDiffPageData(getMementoURL(url, timestamp));
        console.log("Received data:", data);

        const diff = new Diff();
        const diffs = diff.main(data.text, current.text);
        diff.cleanupSemantic(diffs);
        console.log("Viewing diffs:", diffs);
        const html = diff.prettyHtml(diffs);
        const message: Message = { type: "view_text_diff", content: { url: getMementoURL(url, timestamp), timestamp, html } };
        queryCurrentTab().then((tabId: number) => {
            chrome.tabs.sendMessage(tabId, message);
        });
    } else {
        console.log(`Opened ${timestamp} text diff.`);
    }

    setTimeout(() => window.scrollTo(0, 0), 500);

    dispatch(updateState({ id: PageStateId.SHOWING_TEXT_DIFF, data: timestamp }));
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
}




