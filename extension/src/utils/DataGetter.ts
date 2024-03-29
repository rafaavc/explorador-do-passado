import { queryCurrentTab } from "../chrome/utils";
import { ArquivoCDXData, PageMemento, PageTimestamp } from "./ArquivoInterfaces";
import { arquivoDateToDate } from "./ArquivoDate";
import { logEvent } from "./Logger";
import { Message } from "./Message";
import { PageData, PageStateId } from "./Page";
import dev_data from '../dev_data.json'
import { getArquivoCDXDataMessage } from "../chrome/messages";

export const getArquivoCDXData = () => new Promise((resolve, reject) => {
    const message: Message = { type: getArquivoCDXDataMessage }

    const messageResponseHandler = (pageData: PageData<PageTimestamp>) => {
        const arquivoData = pageData.arquivoData
        const mementoList = arquivoData.memento.list
        
        const validArquivoData: ArquivoCDXData = {
            url: arquivoData.url,
            memento: {
                list: [],
                years: arquivoData.memento.years
            },
            title: pageData.arquivoData.title
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
            let timeout: NodeJS.Timeout | null | "nomore" = null;

            const overallTimeout = setTimeout(() => {
                timeout = "nomore";
                reject("Couldn't retrieve page data.");
            }, 10000);

            const cancelTimeout = () => {
                if (timeout == null || timeout == "nomore") return;
                clearTimeout(timeout);
                timeout = null;
            }
            const sendMessage = () => {
                cancelTimeout();
                if (timeout != "nomore") {
                    timeout = setTimeout(() => {
                        console.warn("Timing out...");
                        sendMessage();
                    }, 2000);
                }
                chrome.tabs.sendMessage(tabId, message, (data: PageData<PageTimestamp>) => {
                    cancelTimeout();
                    if (chrome.runtime.lastError)
                    {
                        console.error("Error!!", chrome.runtime.lastError.message);
                        sendMessage();
                    } 
                    else 
                    {
                        clearTimeout(overallTimeout);
                        messageResponseHandler(data);
                    }
                })
            }
            sendMessage()
        })
});

export const getDevData = () => new Promise((resolve) => {
    const validMementoList: PageMemento[] = []
    dev_data.memento.list.forEach((memento) => { validMementoList.push({ timestamp: memento.timestamp, date: arquivoDateToDate(memento.timestamp) }) })

    const validDevData: ArquivoCDXData = {
        url: dev_data.url,
        memento: {
            list: validMementoList,
            years: dev_data.memento.years
        },
        title: dev_data.article.title
    }

    resolve({ arquivoData: validDevData, pageState: { data: "20170420044735", id: PageStateId.SHOWING_SIDE_BY_SIDE } });
});