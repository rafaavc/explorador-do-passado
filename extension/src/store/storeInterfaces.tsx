import { ArquivoData } from "../utils/ArquivoData";
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
    status: String,
    error: any
}

export interface RootState {
    settings: {
        retrieveAtLoad: boolean,
        status: ThunkState
    },
    feedback: {
        open: boolean,
        message: string
    },
    data: DataState
}
