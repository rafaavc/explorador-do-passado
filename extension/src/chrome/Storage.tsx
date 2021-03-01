import { logError } from '../utils/Logger'
import { SettingsOptions } from '../utils/SettingsOptions'

export type Dict = { [index: string]: any }

const setStorage = (obj: Object, place?: string, ...errorInfo: any[]) => {
    chrome.storage.local.set(obj, () => {
        const placeStr = place ? ", in >" + place : "<"
        if (chrome.runtime.lastError && chrome.runtime.lastError.message) logError("ERROR WHILE SETTING CHROME STORAGE: " + chrome.runtime.lastError.message + placeStr, ...errorInfo)
        else if (chrome.runtime.lastError) logError("ERROR WHILE SETTING CHROME STORAGE", ...errorInfo)
    })
}

const getStorage = (keys: string | Object | string[], callback: Function) => {
    chrome.storage.local.get(keys, (value) => {
        callback(value)
    })
}


export const getSettingsValue = (setting: SettingsOptions | SettingsOptions[], callback: Function) => {
    getStorage(setting, callback)
}

export const setSettingsValue = (setting: SettingsOptions, value: any) => {
    const obj: Dict = {}
    obj[setting] = value
 
    setStorage(obj, "setSettingsValue", setting)
}

