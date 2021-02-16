import { Message } from "./Message"

export const logSent = (message: Message) => {
    console.log("Just sent the message:", message)
}

export const logReceived = (message: Message, sender: chrome.runtime.MessageSender) => {
    console.log(`Just received the '${message.type}' message:`, message.content, "from:", sender)
}

export const logResponse = (response: any) => {
    console.log("Just received the response:", response)
}

export const logEvent = (event: string) => {
    console.log("- " + event)
}

