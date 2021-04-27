import { abort } from "process";
import { ArquivoArticle, ArquivoData, PageTimestamp } from "../utils/ArquivoData";
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

let textContent: ContentLanguage = detectBrowserLanguage() == Language.PT ? ptlang : enlang;

const updateLanguage = (language: string) => {
    const lang: Language = strAsLanguage(language);
    textContent = lang == Language.PT ? ptlang : enlang;
}

if (window.location.href.includes('chrome-extension://')) abort();

const pageInfo: PageInfo = {
    url: window.location.href,
    html: document.documentElement.outerHTML
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

const showLoading = () => {
    const loadingElement = document.createElement("div");
    loadingElement.id = "ah-loading";
    document.body.appendChild(loadingElement);
}

const hideLoading = () => {
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

const retrieveArquivoArticle = (url: string) => new Promise<ArquivoArticle>((resolve) => {
    chrome.runtime.sendMessage({ type: "retrieve_arquivo_article", content: { url } }, (response: ArquivoArticle) => {
        resolve(response);
    });
});

const openTextDiff = (data: ArquivoArticle, timestamp: string) => {
    const diff = new diff_match_patch();
    if (arquivoData == undefined) {
        console.error("Trying to view text diff without arquivo data.");
        return;
    }

    const titleDiffs = diff.diff_main(data.title, arquivoData?.article.title);
    diff.diff_cleanupSemantic(titleDiffs);

    const titleHtml = diff.diff_prettyHtml(titleDiffs);

    const diffs = diff.diff_main(data.text, arquivoData?.article.text);
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
        arquivoData = data;
        retrievingPageData = false;
        resolve(data);
    })
})

getSettingsValue([ SettingsOptions.RetrieveAtLoad, SettingsOptions.Language ]).then((res: Dict) => {
    console.log("Received content script settings:", res);
    const retrieveAtLoad = SettingsOptions.RetrieveAtLoad in res ? res[SettingsOptions.RetrieveAtLoad] : true;
    if (retrieveAtLoad === true) retrieveArquivoData(pageInfo);

    if (SettingsOptions.Language in res) updateLanguage(res[SettingsOptions.Language]);
})

const updateLanguageFromStorage = () => new Promise<void>((resolve) => {
    getSettingsValue([ SettingsOptions.Language ]).then((res: Dict) => {    
        if (SettingsOptions.Language in res) updateLanguage(res[SettingsOptions.Language]);
        resolve();
    })
})

const buildPageData = (arquivoData: ArquivoData<PageTimestamp>): PageData<PageTimestamp> => {
    return {
        arquivoData,
        state: pageState
    }
}

const openSideBySideViewing = (url: string, timestamp: string, feedback: boolean) => {
    updateLanguageFromStorage().then(() => {
        openSideBySide(url, timestamp);
        showFloatingBox(url, timestamp);

        if (feedback) showFeedback(textContent.openSideBySide.successMsg);
    });
}

const openTextDiffViewing = (url: string, timestamp: string, feedback: boolean) => {
    updateLanguageFromStorage().then(() => {
        showLoading();
        retrieveArquivoArticle(url)
            .then((data: ArquivoArticle) => {
                hideLoading();
                openTextDiff(data, timestamp);
                showFloatingBox(url, timestamp);

                if (feedback) showFeedback(textContent.openTextDiff.successMsg);
            });
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
        openSideBySideViewing(message.content.url, message.content.timestamp, false);
    } else if (message.type === "view_text_diff") {
        openTextDiffViewing(message.content.url, message.content.timestamp, false);
    } else if (message.type === "close_viewing") {
        closeViewing();
    }
    return true;
});
