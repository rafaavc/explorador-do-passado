import { MementoHistoryEntry } from '../utils/ArquivoInterfaces'
import { logError } from '../utils/Logger'
import { SettingsOptions } from '../utils/SettingsOptions'

export type Dict = { [index: string]: any }

const setStorage = (obj: Object, place?: string, ...errorInfo: any[]) => new Promise<void>((resolve, reject) => {
    chrome.storage.local.set(obj, () => {
        const placeStr = place ? ", in >" + place : "<";
        if (chrome.runtime.lastError && chrome.runtime.lastError.message) {
            logError("ERROR WHILE SETTING CHROME STORAGE: " + chrome.runtime.lastError.message + placeStr, ...errorInfo);
            reject();
        } else if (chrome.runtime.lastError) {
            logError("ERROR WHILE SETTING CHROME STORAGE", ...errorInfo);
            reject();
        }
        else resolve();
    })
})

const getStorage = (keys: string | Object | string[]) => new Promise<Dict>((resolve) => {
    chrome.storage.local.get(keys, (value) => {
        resolve(value)
    })
});


export const getSettingsValue = (setting: SettingsOptions | SettingsOptions[]): Promise<Dict> => {
    return getStorage(setting)
}

export const setSettingsValue = (setting: SettingsOptions, value: any) => {
    const obj: Dict = {}
    obj[setting] = value
    return setStorage(obj, "setSettingsValue", setting);
}

export const getHistory = () => new Promise<MementoHistoryEntry[] | undefined>((resolve) => {
    getStorage("mementoHistory")
        .then((res) => resolve(res["mementoHistory"]));
})

export const writeHistory = (history: MementoHistoryEntry[]): Promise<void> => {
    const obj: Dict = {};
    obj["mementoHistory"] = history;
 
    return setStorage(obj, "writeHistory", history);    
}

export const deleteHistoryStorage = () => {
    chrome.storage.local.remove("mementoHistory");
}

