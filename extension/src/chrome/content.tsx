
chrome.runtime.sendMessage("Hello", (response) => {
    console.log(response)
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request, sender)
});

console.log("Hello from content script");

export {}
