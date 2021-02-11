chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker installed.")
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request, sender, sendResponse)
    sendResponse("HEy")
});

export {}