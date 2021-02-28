
export enum SettingsOptions {
    RetrieveAtLoad = "Settings.RetrieveAtLoad",     // retrieve arquivo data when the page loads? if not, only retrieved when popup is clicked
    DefaultMementoViewingMode = "Settings.DefaultMementoViewingMode"     // if set, when a memento is clicked it is viewed in the way described. if not, a dialog shows up that lets the user choose
}

export const settingsOptAsStr = (setting: SettingsOptions): string => {
    return setting
}
