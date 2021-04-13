import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getHistory, writeHistory } from '../chrome/storage';
import { MementoHistoryEntry } from '../utils/ArquivoData';
import { HistoryState, RootState, ThunkState } from './storeInterfaces';


export interface AddToHistory {
    current: MementoHistoryEntry[],
    added: MementoHistoryEntry
}

export const addToHistory = createAsyncThunk('settings/toggleRetrieveAtLoad', async (diff: AddToHistory): Promise<MementoHistoryEntry[]> => {
    const copy = [ ...diff.current ];
    copy.push(diff.added);
    writeHistory(copy); // async
    return copy;
    
});

export const fetchHistory = createAsyncThunk('history/fetchHistory', async (): Promise<{ entries: MementoHistoryEntry[] }> => {
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

