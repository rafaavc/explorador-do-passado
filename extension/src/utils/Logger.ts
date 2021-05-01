import { Message } from "./Message"

export const logReceived = (message: Message, sender: chrome.runtime.MessageSender, ...others: Array<any>) => {
    console.log(`Just received the '${message.type}' message:`, message.content, "from:", sender, ...others)
}

export const logEvent = (event: string, ...others: Array<any>) => {
    console.log("- " + event, ...others)
}

export const logError = (error: string, ...others: Array<any>) => {
    console.error(error, ...others)
}

