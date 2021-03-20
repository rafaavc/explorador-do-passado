import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getContentData, getDevData } from "../utils/DataGetter";
import { PageState, PageStateId } from "../utils/Page";
import { DataState, RootState, ThunkState } from "./storeInterfaces";

const initialState: DataState = {
    pageState: {
        id: PageStateId.START,
        data: null
    },
    arquivoData: null,
    status: 'idle',
    error: null    
}

export const fetchData = createAsyncThunk('data/fetchData', async () => {
    const data = process.env.NODE_ENV == "production" ? await getContentData() : await getDevData();
    return data;
})

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        updateState: (state, action: { payload: PageState }) => {
            state.pageState = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.status = ThunkState.Waiting;
            })
            .addCase(fetchData.fulfilled, (state, action: { payload: any }) => {
                state.status = ThunkState.Success;
                state.pageState = action.payload.pageState;
                state.arquivoData = action.payload.arquivoData;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = ThunkState.Failed;
                state.error = action.payload;
            })
    }
});

export const selectArquivoData = (state: RootState) => state.data.arquivoData;

export const selectPageState = (state: RootState) => state.data.pageState;

export const selectDataStatus = (state: RootState) => state.data.status;

export default dataSlice.reducer;

