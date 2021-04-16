import { PopupLanguage } from "../text/PopupLanguage";
import { ArquivoData, MementoHistoryEntry } from "../utils/ArquivoData";
import { PageState } from "../utils/Page";

export enum ThunkState {
    Waiting = "waiting",
    Success = "success",
    Failed = "failed",
    Idle = "idle"
}

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

export interface DataState {
    arquivoData: ArquivoData|null,
    pageState: PageState,
    status: String,
    error: any
}

export interface HistoryState {
    entries: MementoHistoryEntry[],
    status: ThunkState
}

export interface RootState {
    settings: {
        retrieveAtLoad: boolean,
        status: ThunkState,
        language: {
            lang: Language,
            text: PopupLanguage
        }
    },
    feedback: {
        open: boolean,
        message: string
    },
    history: HistoryState,
    data: DataState
}
