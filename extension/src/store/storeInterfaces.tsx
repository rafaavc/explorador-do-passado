import { ArquivoData } from "../utils/ArquivoData";
import { PageState } from "../utils/Page";

export enum ThunkState {
    Waiting = "waiting",
    Success = "success",
    Failed = "failed"
}

export interface DataState {
    arquivoData: ArquivoData|null,
    pageState: PageState,
    status: String,
    error: any
}

export interface RootState {
    settings: {
        retrieveAtLoad: boolean
    },
    data: DataState
}
