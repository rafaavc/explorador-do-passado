import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getHistory, writeHistory } from '../chrome/storage';
import { MementoHistoryEntry } from '../utils/ArquivoData';
import { HistoryState, RootState, ThunkState } from './storeInterfaces';


export interface AddToHistory {
    current: MementoHistoryEntry[],
    added: MementoHistoryEntry,
    maxHistoryEntries: number
}

export const addToHistory = createAsyncThunk('history/addToHistory', async (diff: AddToHistory): Promise<MementoHistoryEntry[]> => {
    const newUrl = new URL(diff.added.url);
    diff.added.url = newUrl.hostname + newUrl.pathname;

    console.log(`Adding '${diff.added.url}' to memento history.`);
    
    const copy = diff.current.filter((el: MementoHistoryEntry) => el.url != diff.added.url || el.mementoTimestamp != diff.added.mementoTimestamp);
    copy.push(diff.added);

    if (copy.length > diff.maxHistoryEntries) copy.splice(0, copy.length - diff.maxHistoryEntries);

    writeHistory(copy);
    return copy;
    
});

export const fetchHistory = createAsyncThunk('history/fetchHistory', async (): Promise<{ entries: MementoHistoryEntry[] }> => {
    if (process.env.NODE_ENV != "production") {
        return {
            entries: [
                {
                    mementoTimestamp: "20120703151615",
                    title: "PÚBLICO",
                    url: "www.publico.pt/",
                    viewedTimestamp: 1618499944163
                },
                {
                    mementoTimestamp: "20001017215803",
                    title: "PÚBLICO",
                    url: "www.publico.pt/",
                    viewedTimestamp: 1618500116186
                },
                {
                    mementoTimestamp: "20050310023349",
                    title: "PÚBLICO",
                    url: "www.publico.pt/",
                    viewedTimestamp: 1618500130123
                },
                {
                    mementoTimestamp: "20020807183932",
                    title: "PÚBLICO",
                    url: "www.publico.pt/",
                    viewedTimestamp: 1618500199664
                }
            ]
        };
    }

    const entries: MementoHistoryEntry[] | undefined = await getHistory();
    console.log("Received the value of history:", entries);
    if (entries == undefined) return { entries: [] };
    return { entries };
});

const initialState: HistoryState = {
    entries: [],
    status: ThunkState.Idle
}

export const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addToHistory.fulfilled, (state, action: { payload: MementoHistoryEntry[] }) => {
                state.entries = action.payload;
            })
            .addCase(fetchHistory.pending, (state) => {
                state.status = ThunkState.Waiting;
            })
            .addCase(fetchHistory.fulfilled, (state, action: { payload: { entries: MementoHistoryEntry[] } }) => {
                state.entries = action.payload.entries;
                state.status = ThunkState.Success;
            })
            .addCase(fetchHistory.rejected, (state, action: { payload: any }) => {
                if (process.env.NODE_ENV == "development") {
                    state.status = ThunkState.Success;
                    console.error(action.payload);
                    return;
                }
                state.status = ThunkState.Failed;
                console.error(action.payload);
            })
    }
});

export const selectHistory = (state: RootState) => state.history.entries;

export const selectHistoryStatus = (state: RootState) => state.history.status;

export default historySlice.reducer;

