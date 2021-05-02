import { abort } from "process";
import { ArquivoArticle, ArquivoCDXData, PageTimestamp } from "../utils/ArquivoInterfaces";
import { logReceived } from "../utils/Logger";
import { Message } from "../utils/Message";
import { PageData, PageInfo, PageState, PageStateId } from "../utils/Page";
import { SettingsOptions } from "../utils/SettingsOptions";
import { getSettingsValue, Dict } from "./storage";
import { arquivoDateToDate, getHumanReadableDate } from "../utils/ArquivoDate";
import { copyToClipboard } from "../utils/Clipboard";
import { ContentLanguage } from "../text/ContentLanguage";
import { detectBrowserLanguage, Language, strAsLanguage } from "../utils/Language";
import diff_match_patch from "./diff_match_patch";
import ptlang from '../text/content_pt.json';
import enlang from '../text/content_en.json';
import { closeViewingMessage, getArquivoCDXDataMessage, retrieveArquivoArticleMessage, retrieveArquivoCDXDataMessage, viewSideBySideMessage, viewTextDiffMessage } from "./messages";

let textContent: ContentLanguage = detectBrowserLanguage() == Language.PT ? ptlang : enlang;

const updateLanguage = (language: string) => {
    const lang: Language = strAsLanguage(language);
    textContent = lang == Language.PT ? ptlang : enlang;
}

if (window.location.href.includes('chrome-extension://')) abort();

const pageInfo: PageInfo = {
    url: window.location.href,
    html: document.documentElement.outerHTML,
    title: document.title
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

let feedback: HTMLDivElement | null = null;

const closeFeedback = (box: HTMLDivElement | null) => new Promise<void>((resolve) => {
    if (box == null) {
        resolve();
        return;
    }

    box.style.animation = 'ah-disappear-kf .15s ease both';
    setTimeout(() => {
        box.remove()
        resolve();
    }, 200);
});

const showFeedback = (content: string) => {
    closeFeedback(feedback).then(() => {
        const box = document.createElement('div');
        box.id = 'ah-feedback';
        box.innerText = content;
    
        document.body.appendChild(box);
    
        setTimeout(() => {
            closeFeedback(box);
            if (feedback == box) feedback = null;
        }, 3000);
    })
}

let nextLoadingId = 1;
let loadingState: number = 0;

const getNextLoadingId = (): number => {
    const tmp = nextLoadingId;
    nextLoadingId++;
    return tmp;
}

const showLoading = (): number => {
    if (loadingState) console.error("Trying to show loading while already loading.");
    loadingState = getNextLoadingId();
    console.log("Got new loading id:", loadingState);

    const loadingElement = document.createElement("div");
    loadingElement.id = "ah-loading";
    document.body.appendChild(loadingElement);

    return loadingState;
}

const hideLoading = () => {
    if (!loadingState) console.error("Trying to hide loading while already not loading.");
    loadingState = 0;

    document.querySelector("#ah-loading")?.remove();
}

const showFloatingBox = (url: string, timestamp: string) => {
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
                    ${textContent.openInNew.text}
                </div>
            </li>
            <li>
                <button class="ah-has-tooltip ah-open-opposite">
                    <span class="material-icons">${pageState.id == PageStateId.SHOWING_SIDE_BY_SIDE ? "notes" : "compare"}</span>
                </button>
                <div class="ah-tooltip">
                    ${pageState.id == PageStateId.SHOWING_SIDE_BY_SIDE ? textContent.openTextDiff.text : textContent.openSideBySide.text}
                </div>
            </li>
            <li>
                <button class="ah-has-tooltip ah-copy-url">
                    <span class="material-icons">content_copy</span>
                </button>
                <div class="ah-tooltip">
                    ${textContent.copyURL.text}
                </div>
            </li>
            <li>
                <button class="ah-has-tooltip ah-close">
                    <span class="material-icons">close</span>
                </button>
                <div class="ah-tooltip">
                    ${textContent.stopViewing.text}
                </div>
            </li>
        </ul>`;

    box.querySelector(".ah-open-opposite")?.addEventListener('click', () => {
        if (pageState.id == PageStateId.SHOWING_SIDE_BY_SIDE) {
            openTextDiffViewing(url, timestamp, true);
        } else {
            openSideBySideViewing(url, timestamp, true);
        }
    });
    box.querySelector(".ah-open-in-new")?.addEventListener('click', () => window.open(url));
    box.querySelector(".ah-copy-url")?.addEventListener('click', () => { copyToClipboard(url); showFeedback(textContent.copyURL.successMsg); });
    box.querySelector(".ah-close")?.addEventListener('click', closeViewing);

    document.body.appendChild(box);
}

const hideFloatingBox = () => {
    document.querySelector("#ah-floating-box")?.remove();
}

let arquivoData: ArquivoCDXData<PageTimestamp> | null = null;
let originalArquivoArticle: ArquivoArticle | null = null;
let pageState: PageState = {
    id: PageStateId.START,
    data: null
}

let retrievingPageData: boolean = false;
let retrievingArquivoArticle: boolean = false;

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

const openTextDiff = (data: ArquivoArticle, timestamp: string) => {
    const diff = new diff_match_patch();
    if (originalArquivoArticle == undefined) {
        console.error("Trying to view text diff without arquivo data.");
        return;
    }

    const titleDiffs = diff.diff_main(data.title, originalArquivoArticle.title);
    diff.diff_cleanupSemantic(titleDiffs);

    const titleHtml = diff.diff_prettyHtml(titleDiffs);

    const diffs = diff.diff_main(data.text, originalArquivoArticle.text);
    diff.diff_cleanupSemantic(diffs);
    console.log("Viewing diffs:", diffs);
    const html = diff.diff_prettyHtml(diffs);

    const container = document.createElement('div');
    container.id = 'ah-text-diff-content';

    const pageTitle = document.createElement('h1');
    pageTitle.innerHTML = titleHtml;
    container.appendChild(pageTitle);

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
    container.appendChild(content);
    body.appendChild(container);
    newDoc.appendChild(body);

    saved = pageState.id != PageStateId.START ? saved : document.documentElement.innerHTML;
    document.documentElement.innerHTML = newDoc.innerHTML;

    pageState.id = PageStateId.SHOWING_TEXT_DIFF
    pageState.data = timestamp
}

const closeViewing = () => {
    const aborted = abortLoading();
    hideFloatingBox();
    if (pageState.id != PageStateId.START && saved) {
        document.documentElement.innerHTML = saved;
        pageState.id = PageStateId.START;
        pageState.data = null;
    }
    if (aborted) showFeedback(textContent.cancelledTaskMessage);
}

const retrieveArquivoArticle = (url: string, loadingId?: number) => new Promise<{article: ArquivoArticle, loadingId?: number}>((resolve) => {
    chrome.runtime.sendMessage({ type: retrieveArquivoArticleMessage, content: { url } }, (response: ArquivoArticle) => {
        resolve({ article: response, loadingId });
    });
});

const retrieveOriginalArquivoArticle = () => new Promise<void>((resolve) => {
    retrievingArquivoArticle = true;
    retrieveArquivoArticle(pageInfo.url)
        .then((data: { article: ArquivoArticle }) => {
            originalArquivoArticle = data.article
            retrievingArquivoArticle = false;
            console.log("Received original arquivo article info.", data.article);
            resolve();
        });
});

const retrieveArquivoCDXData = () => new Promise<ArquivoCDXData<PageTimestamp>>((resolve) => {
    retrievingPageData = true
    chrome.runtime.sendMessage({ type: retrieveArquivoCDXDataMessage, content: pageInfo }, (data: ArquivoCDXData<PageTimestamp>) => { 
        arquivoData = data;
        retrievingPageData = false;
        resolve(data);
    })
})

getSettingsValue([ SettingsOptions.RetrieveAtLoad, SettingsOptions.Language ]).then((res: Dict) => {
    console.log("Received content script settings:", res);
    const retrieveAtLoad = SettingsOptions.RetrieveAtLoad in res ? res[SettingsOptions.RetrieveAtLoad] : true;
    if (retrieveAtLoad === true) retrieveArquivoCDXData();

    if (SettingsOptions.Language in res) updateLanguage(res[SettingsOptions.Language]);
})

const updateLanguageFromStorage = () => new Promise<void>((resolve) => {
    getSettingsValue([ SettingsOptions.Language ]).then((res: Dict) => {    
        if (SettingsOptions.Language in res) updateLanguage(res[SettingsOptions.Language]);
        resolve();
    })
})

const buildPageData = (arquivoData: ArquivoCDXData<PageTimestamp>): PageData<PageTimestamp> => {
    return {
        arquivoData,
        state: pageState
    }
}

const openSideBySideViewing = (url: string, timestamp: string, feedback: boolean) => {
    const aborted = abortLoading();
    const extra = () => { if (aborted) showFeedback(textContent.cancelledTaskMessage); }
    updateLanguageFromStorage().then(() => {
        openSideBySide(url, timestamp);
        showFloatingBox(url, timestamp);

        if (feedback) showFeedback(textContent.openSideBySide.successMsg);
        extra();
    });
}

const openTextDiffViewing = (url: string, timestamp: string, feedback: boolean) => {
    if (abortLoading()) showFeedback(textContent.cancelledTaskMessage);
    updateLanguageFromStorage().then(() => {
        const mementoArticleAction = (data: {article: ArquivoArticle, loadingId?: number}) => {
            const { article, loadingId } = data;
            if (loadingId != loadingState) {
                console.error("Finished loading but realized I was cancelled :(");
                return; // if it was cancelled
            }

            hideLoading();
            openTextDiff(article, timestamp);
            showFloatingBox(url, timestamp);

            if (feedback) showFeedback(textContent.openTextDiff.successMsg);
        }

        const mementoArticlePromise = retrieveArquivoArticle(url, showLoading());

        if (originalArquivoArticle == null) {
            const originalArticlePromise = retrieveOriginalArquivoArticle();
            Promise.all([originalArticlePromise, mementoArticlePromise])
                .then(([_original, mementoArticleData]: [void, {article: ArquivoArticle, loadingId?: number}]) => {
                    mementoArticleAction(mementoArticleData);
                });
        } else {
            mementoArticlePromise.then(mementoArticleAction);
        }

    });
}

const abortLoading = (): boolean => {
    console.log("Aborting loading... Current loadingState =", loadingState);
    if (loadingState != 0) {
        hideLoading();
        return true;
    }
    return false;
}

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    logReceived(message, sender);
    if (message.type === getArquivoCDXDataMessage) {
        if (arquivoData) sendResponse(buildPageData(arquivoData));
        else if (!retrievingPageData) {
            retrieveArquivoCDXData()
                .then((arquivoData: ArquivoCDXData<PageTimestamp>) => { sendResponse(buildPageData(arquivoData)) });
        }
    } else if (message.type === viewSideBySideMessage) {
        openSideBySideViewing(message.content.url, message.content.timestamp, false);
    } else if (message.type === viewTextDiffMessage) {

        openTextDiffViewing(message.content.url, message.content.timestamp, false);
    } else if (message.type === closeViewingMessage) {
        closeViewing();
    }
    return true;
});
