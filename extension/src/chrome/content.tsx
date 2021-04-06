import { abort } from "process";
import { ArquivoData, PageTimestamp } from "../utils/ArquivoData";
import { logReceived } from "../utils/Logger";
import { Message } from "../utils/Message";
import { DiffPageData, PageData, PageInfo, PageState, PageStateId } from "../utils/Page";
import { SettingsOptions } from "../utils/SettingsOptions";
import { getSettingsValue, Dict } from "./Storage";
import diff_match_patch from "./diff_match_patch";

if (window.location.href.includes('chrome-extension://')) abort();

const pageInfo: PageInfo = {
    url: window.location.href,
    html: document.documentElement.outerHTML
}

const startLoading = () => {
    const loadingElement = document.createElement("div");
    loadingElement.id = "ah-loading";
    document.body.append(loadingElement);
}

const stopLoading = () => {
    document.getElementById("ah-loading")?.remove();
}

let arquivoData: ArquivoData<PageTimestamp> | null = null
let pageState: PageState = {
    id: PageStateId.START,
    data: null
}

let retrievingPageData: boolean = false

let saved: string | null = null;

const openSideBySide = (url: string, timestamp: string) => {
    pageState.id = PageStateId.SHOWING_SIDE_BY_SIDE
    pageState.data = timestamp

    const iframe1 = document.createElement('iframe')
    iframe1.srcdoc = document.documentElement.outerHTML
    iframe1.style.width = "50%"
    iframe1.style.position = "absolute"
    iframe1.style.left = "0"
    iframe1.style.height = window.innerHeight + "px"
    iframe1.style.border = 'none'
    const iframe2 = document.createElement('iframe')
    iframe2.src = url
    iframe2.style.width = "50%"
    iframe2.style.position = "absolute"
    iframe2.style.left = "50%"
    iframe2.style.height = window.innerHeight + "px"
    iframe2.style.border = 'none'

    const newDoc = document.createElement('html')
    const head = document.createElement('head')
    const title = document.createElement('title')
    title.innerText = "Side by Side"
    head.appendChild(title)
    newDoc.appendChild(head)
    const body = document.createElement('body')
    body.style.margin = '0'
    body.appendChild(iframe1)
    body.appendChild(iframe2)
    newDoc.appendChild(body)

    saved = document.documentElement.innerHTML
    document.documentElement.innerHTML = newDoc.innerHTML
}

const retrieveDiffPageData = (url: string) => new Promise<DiffPageData>((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "retrieve_diff_page_data", content: { url } }, (response: DiffPageData) => {
        resolve(response);
    });
});

const openTextDiff = (data: DiffPageData, currentText: string, timestamp: string) => {
    console.log("Received data:", data);

    const diff = new diff_match_patch();
    const diffs = diff.diff_main(data.text, currentText);
    diff.diff_cleanupSemantic(diffs);
    console.log("Viewing diffs:", diffs);
    const html = diff.diff_prettyHtml(diffs);
    

    pageState.id = PageStateId.SHOWING_TEXT_DIFF;
    pageState.data = timestamp;

    const content = document.createElement('p');
    content.innerHTML = html;

    const newDoc = document.createElement('html');
    const head = document.createElement('head');
    const title = document.createElement('title');
    title.innerText = "Text Diff";
    head.appendChild(title);
    newDoc.appendChild(head);
    const body = document.createElement('body');
    body.style.margin = '0';
    body.appendChild(content);
    newDoc.appendChild(body);

    saved = document.documentElement.innerHTML;
    document.documentElement.innerHTML = newDoc.innerHTML;
}

const closeViewing = () => {
    if (pageState.id != PageStateId.START && saved) {
        document.documentElement.innerHTML = saved;
        pageState.id = PageStateId.START;
        pageState.data = null;
    }
}

const retrieveArquivoData = (pageInfo: PageInfo) => new Promise<ArquivoData<PageTimestamp>>((resolve) => {
    retrievingPageData = true
    chrome.runtime.sendMessage({ type: "retrieve_page_data", content: pageInfo }, (data: ArquivoData<PageTimestamp>) => { 
        arquivoData = data
        retrievingPageData = false
        resolve(data) 
    })
})

getSettingsValue(SettingsOptions.RetrieveAtLoad).then((res: Dict) => {
    console.log("Received the value of " + SettingsOptions.RetrieveAtLoad + ":", res)
    const value = SettingsOptions.RetrieveAtLoad in res ? res[SettingsOptions.RetrieveAtLoad] : true
    if (value === true) retrieveArquivoData(pageInfo)
})

const buildPageData = (arquivoData: ArquivoData<PageTimestamp>): PageData<PageTimestamp> => {
    return {
        arquivoData,
        state: pageState
    }
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    logReceived(message, sender);
    if (message.type === "get_page_data") {
        if (arquivoData) sendResponse(buildPageData(arquivoData))
        else if (!retrievingPageData) {
            retrieveArquivoData(pageInfo)
                .then((arquivoData: ArquivoData<PageTimestamp>) => { sendResponse(buildPageData(arquivoData)) });
        }
    } else if (message.type === "view_side_by_side") {
        openSideBySide(message.content.url, message.content.timestamp);
    } else if (message.type === "view_text_diff") {
        startLoading();
        retrieveDiffPageData(message.content.url)
            .then((data: DiffPageData) => {
                openTextDiff(data, message.content.currentText, message.content.timestamp);
                stopLoading();
            });
        console.log("Received view_diff");
    } else if (message.type === "close_viewing") {
        closeViewing();
    }
    return true;
});
