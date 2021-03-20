import { queryCurrentTab } from "../chrome/utils";
import { ArquivoData, PageMemento, PageTimestamp } from "./ArquivoData";
import { arquivoDateToDate } from "./ArquivoDate";
import { logEvent } from "./Logger";
import { Message } from "./Message";
import { PageData, PageStateId } from "./Page";
import dev_data from '../dev_data.json'

export const getContentData = () => new Promise((resolve) => {
    const message: Message = { type: "get_page_data" }

    const messageResponseHandler = (pageData: PageData<PageTimestamp>) => {
        const arquivoData = pageData.arquivoData
        const mementoList = arquivoData.memento.list
        
        const validArquivoData: ArquivoData = {
            url: arquivoData.url,
            memento: {
                list: [],
                years: arquivoData.memento.years
            },
            article: arquivoData.article
        }

        for (const memento of mementoList) {
            const date = arquivoDateToDate(memento.timestamp)
            validArquivoData.memento.list.push({ date, timestamp: memento.timestamp })
        }

        resolve({ arquivoData: validArquivoData, pageState: pageData.state})
        logEvent("Received data:", pageData)
    }

    queryCurrentTab()
        .then((tabId: number) => {
            // need to add timeout (if too long show error)
            const sendMessage = () => {
                chrome.tabs.sendMessage(tabId, message, (data: PageData<PageTimestamp>) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error!!", chrome.runtime.lastError.message)
                        setTimeout(sendMessage, 1000)
                    } else messageResponseHandler(data)
                })
            }
            sendMessage()
        })
});

export const getDevData = () => new Promise((resolve) => {
    const validMementoList: PageMemento[] = []
    dev_data.memento.list.forEach((memento) => { validMementoList.push({ timestamp: memento.timestamp, date: arquivoDateToDate(memento.timestamp) }) })

    const validDevData: ArquivoData = {
        url: dev_data.url,
        article: dev_data.article,
        memento: {
            list: validMementoList,
            years: dev_data.memento.years
        }
    }

    resolve({ arquivoData: validDevData, pageState: { data: null, id: PageStateId.START } });
});