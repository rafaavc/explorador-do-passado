import { PopupLanguage } from "../text/PopupLanguage";
import { ArquivoData, MementoHistoryEntry } from "../utils/ArquivoData";
import { Language } from "../utils/Language";
import { PageState } from "../utils/Page";

export enum ThunkState {
    Waiting = "waiting",
    Success = "success",
    Failed = "failed",
    Idle = "idle"
}

export interface DataState {
    arquivoData: ArquivoData|null,
    pageState: PageState,
    status: ThunkState,
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
        },
        historyMax: number,
        defaultEntitiesState: boolean
    },
    feedback: {
        open: boolean,
        message: string
    },
    history: HistoryState,
    data: DataState
}
