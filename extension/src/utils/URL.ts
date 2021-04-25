
const openURL = (url: string) => {
    if (process.env.NODE_ENV === "production") {
        chrome.tabs.create({ url, active: true })
    } else {  // TODO
        
    }
}

const getMementoURL = (url: string | undefined, timestamp: string): string => {
    if (url == undefined) {
        console.error("Received null arquivo article in 'openTextDiff'");
        return "";
    }
    return `https://arquivo.pt/noFrame/replay/${timestamp}/${url}`
}

const getFaviconURL = (url: string | undefined): string => {
    return 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + url;
}

export { openURL, getMementoURL, getFaviconURL }
