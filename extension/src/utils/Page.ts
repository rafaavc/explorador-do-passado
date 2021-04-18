import { ArquivoData } from "./ArquivoData";

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
    html: string
};

export interface PageState {
    id: PageStateId,
    data: any
};

export interface PageData<T> {
    arquivoData: ArquivoData<T>,
    state: PageState
};

export interface DiffPageData {
    title: string,
    authors: Array<string>,
    text: string,
    top_image: string
};

