import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getArquivoCDXData, getDevData } from "../utils/DataGetter";
import { PageState, PageStateId } from "../utils/Page";
import { DataState, RootState, ThunkState } from "./storeInterfaces";

const initialState: DataState = {
    pageState: {
        id: PageStateId.START,
        data: null
    },
    arquivoCDXData: null,
    status: ThunkState.Idle,
    error: null    
}

export const fetchData = createAsyncThunk('data/fetchData', async () => {
    return process.env.NODE_ENV == "production" ? await getArquivoCDXData() : await getDevData();
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
                state.arquivoCDXData = action.payload.arquivoData;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.status = ThunkState.Failed;
                state.error = action.payload;
            })
    }
});

export const { updateState } = dataSlice.actions;

export const selectArquivoCDXData = (state: RootState) => state.data.arquivoCDXData;

export const selectPageState = (state: RootState) => state.data.pageState;

export const selectDataStatus = (state: RootState) => state.data.status;

export default dataSlice.reducer;

