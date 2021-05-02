import { ArquivoCDXData } from "./ArquivoInterfaces";

export enum PageStateId {
    START,
    SHOWING_SIDE_BY_SIDE,
    SHOWING_TEXT_DIFF
}; 

export interface SideBySideStateData {
    timestampBeingViewed: string
};

export interface PageInfo {
    url: string,
    html: string,
    title: string
};

export interface PageState {
    id: PageStateId,
    data: any
};

export interface PageData<T> {
    arquivoData: ArquivoCDXData<T>,
    state: PageState
};

