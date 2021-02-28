import { logError } from '../utils/Logger'
import { SettingsOptions } from '../utils/SettingsOptions'

export const getSettingsValue = (setting: SettingsOptions | SettingsOptions[], callback: Function) => {
    chrome.storage.local.get(setting, (value) => {
        callback(value)
    })
}

export const setSettingsValue = (setting: SettingsOptions, value: any) => {
    type Dict = { [index: string]: string }

    const obj: Dict = {}
    obj[setting] = value
 
    chrome.storage.local.set(obj, () => {
        if (chrome.runtime.lastError && chrome.runtime.lastError.message) logError("ERROR WHILE SETTING SETTINGS VALUE: " + chrome.runtime.lastError.message, setting)
        else if (chrome.runtime.lastError) logError("ERROR WHILE SETTING SETTINGS VALUE", setting)
    })
}


export const storeTabState = () => {

}

