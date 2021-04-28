export enum Language {
    PT = "PT",
    EN = "EN",
    ERROR = "ERROR"
}

export const languageAsStr = (language: Language): string => language;
export const strAsLanguage = (language: string): Language => {
    if (language == "PT") return Language.PT;
    if (language == "EN") return Language.EN;
    console.error("LANGUAGE NOT FOUND: ", language);
    return Language.ERROR;
}

export const detectBrowserLanguage = (): Language => {
    const navigatorLanguage = (navigator.languages && navigator.languages[0]) || navigator.language; // mavigator.userLanguage doesn't exist?
    const lang = navigatorLanguage.substring(0, 2).toUpperCase();
    const converted = strAsLanguage(lang);
    if (converted == Language.ERROR) return Language.EN;
    return converted;
}