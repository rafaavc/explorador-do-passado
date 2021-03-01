
const openURL = (url: string) => {
    if (process.env.NODE_ENV === "production") {
        chrome.tabs.create({ url, active: true })
    } else {  // TODO
        
    }
}

const getMementoURL = (url: string, timestamp: string): string => {
    return `https://arquivo.pt/noFrame/replay/${timestamp}/${url}`
}

const openMemento = (url: string, timestamp: string): void => {
    openURL(getMementoURL(url, timestamp))
}

export { openURL, openMemento, getMementoURL }
