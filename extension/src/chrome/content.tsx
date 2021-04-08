import { abort } from "process";
import { ArquivoData, PageTimestamp } from "../utils/ArquivoData";
import { logReceived } from "../utils/Logger";
import { Message } from "../utils/Message";
import { DiffPageData, PageData, PageInfo, PageState, PageStateId } from "../utils/Page";
import { SettingsOptions } from "../utils/SettingsOptions";
import { getSettingsValue, Dict } from "./storage";
import diff_match_patch from "./diff_match_patch";
import textContent from "../text/content_en.json";
import { arquivoDateToDate, getHumanReadableDate } from "../utils/ArquivoDate";
import { openURL } from "../utils/URL";
import { copyToClipboard } from "../utils/Clipboard";

if (window.location.href.includes('chrome-extension://')) abort();

const pageInfo: PageInfo = {
    url: window.location.href,
    html: document.documentElement.outerHTML
}

const showLoading = () => {
    const loadingElement = document.createElement("div");
    loadingElement.id = "ah-loading";
    document.body.appendChild(loadingElement);
}

const hideLoading = () => {
    document.querySelector("#ah-loading")?.remove();
}

const loadExtraCSS = () => {
    const font = document.createElement('link');
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap";

    const icons = document.createElement('link');
    icons.rel = "stylesheet";
    icons.href = "https://fonts.googleapis.com/icon?family=Material+Icons";

    document.head.appendChild(font);
    document.head.appendChild(icons);
}

const showFloatingBox = (url: string, currentText: string, timestamp: string) => {
    loadExtraCSS();  // every time the box will be shown is after changing the whole html tree

    const mode = pageState.id == PageStateId.SHOWING_SIDE_BY_SIDE ? textContent.sideBySideTitle : textContent.textDiffTitle;

    const box = document.createElement("div");
    box.id = "ah-floating-box";
    box.innerHTML = `<p class="ah-sticker">${textContent.serviceName}</p>
        <h3>${textContent.titlePrefix} ${mode}</h3>
        <p>${textContent.traveledTo} ${getHumanReadableDate(arquivoDateToDate(timestamp), textContent.dates.weekdays.long, textContent.dates.dayLabel, textContent.dates.locale, textContent.dates.months.long)}.</p>
        <ul>
            <li>
                <button class="ah-has-tooltip ah-open-in-new">
                    <span class="material-icons">open_in_new</span>
                </button>
                <div class="ah-tooltip">
                    ${textContent.openInNew}
                </div>
            </li>
            <li>
                <button class="ah-has-tooltip ah-open-opposite">
                    <span class="material-icons">${pageState.id == PageStateId.SHOWING_SIDE_BY_SIDE ? "notes" : "compare"}</span>
                </button>
                <div class="ah-tooltip">
                    ${pageState.id == PageStateId.SHOWING_SIDE_BY_SIDE ? textContent.openTextDiff : textContent.openSideBySide}
                </div>
            </li>
            <li>
                <button class="ah-has-tooltip ah-copy-url">
                    <span class="material-icons">content_copy</span>
                </button>
                <div class="ah-tooltip">
                    ${textContent.copyURL}
                </div>
            </li>
            <li>
                <button class="ah-has-tooltip ah-close">
                    <span class="material-icons">close</span>
                </button>
                <div class="ah-tooltip">
                    ${textContent.stopViewing}
                </div>
            </li>
        </ul>`;

    box.querySelector(".ah-open-opposite")?.addEventListener('click', () => {
        if (pageState.id == PageStateId.SHOWING_SIDE_BY_SIDE) {
            openTextDiffViewing(url, timestamp, currentText);
        } else {
            openSideBySideViewing(url, timestamp, currentText);
        }
    });
    box.querySelector(".ah-open-in-new")?.addEventListener('click', () => window.open(url));
    box.querySelector(".ah-copy-url")?.addEventListener('click', copyToClipboard.bind(undefined, url));
    box.querySelector(".ah-close")?.addEventListener('click', closeViewing);

    document.body.appendChild(box);
}

const hideFloatingBox = () => {
    document.querySelector("#ah-floating-box")?.remove();
}

let arquivoData: ArquivoData<PageTimestamp> | null = null
let pageState: PageState = {
    id: PageStateId.START,
    data: null
}

let retrievingPageData: boolean = false

let saved: string | null = null;

const openSideBySide = (url: string, timestamp: string) => {
    const iframe1 = document.createElement('iframe')
    iframe1.srcdoc = pageState.id != PageStateId.START && saved ? saved : document.documentElement.innerHTML
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
    title.innerText = document.title;
    head.appendChild(title)
    newDoc.appendChild(head)
    const body = document.createElement('body')
    body.style.margin = '0'
    body.appendChild(iframe1)
    body.appendChild(iframe2)
    newDoc.appendChild(body)

    saved = pageState.id != PageStateId.START ? saved : document.documentElement.innerHTML
    document.documentElement.innerHTML = newDoc.innerHTML

    pageState.id = PageStateId.SHOWING_SIDE_BY_SIDE
    pageState.data = timestamp
}

const retrieveDiffPageData = (url: string) => new Promise<DiffPageData>((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "retrieve_diff_page_data", content: { url } }, (response: DiffPageData) => {
        resolve(response);
    });
});

const openTextDiff = (data: DiffPageData, currentText: string, timestamp: string) => {
    const diff = new diff_match_patch();
    const diffs = diff.diff_main(data.text, currentText);
    diff.diff_cleanupSemantic(diffs);
    console.log("Viewing diffs:", diffs);
    const html = diff.diff_prettyHtml(diffs);

    const content = document.createElement('p');
    content.innerHTML = html;

    const newDoc = document.createElement('html');
    const head = document.createElement('head');
    const title = document.createElement('title');
    title.innerText = document.title;
    head.appendChild(title);
    newDoc.appendChild(head);
    const body = document.createElement('body');
    body.style.margin = '0';
    body.appendChild(content);
    newDoc.appendChild(body);

    saved = pageState.id != PageStateId.START ? saved : document.documentElement.innerHTML;
    document.documentElement.innerHTML = newDoc.innerHTML;

    pageState.id = PageStateId.SHOWING_TEXT_DIFF
    pageState.data = timestamp
}

const closeViewing = () => {
    hideFloatingBox();
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

const openSideBySideViewing = (url: string, timestamp: string, currentText: string) => {
    openSideBySide(url, timestamp);
    showFloatingBox(url, currentText, timestamp);
}

const openTextDiffViewing = (url: string, timestamp: string, currentText: string) => {
    showLoading();
    retrieveDiffPageData(url)
        .then((data: DiffPageData) => {
            hideLoading();
            openTextDiff(data, currentText, timestamp);
            showFloatingBox(url, currentText, timestamp);
        });
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
        openSideBySideViewing(message.content.url, message.content.timestamp, message.content.currentText);
    } else if (message.type === "view_text_diff") {
        openTextDiffViewing(message.content.url, message.content.timestamp, message.content.currentText);
    } else if (message.type === "close_viewing") {
        closeViewing();
    }
    return true;
});
