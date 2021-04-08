import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSettingsValue, setSettingsValue } from '../chrome/storage';
import { SettingsOptions } from '../utils/SettingsOptions';
import { RootState, ThunkState } from './storeInterfaces';



export const toggleRetrieveAtLoad = createAsyncThunk('settings/toggleRetrieveAtLoad', async (current: boolean) => {
    await setSettingsValue(SettingsOptions.RetrieveAtLoad, !current);
    return !current;
});

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async () => {
    const settings = await getSettingsValue([ SettingsOptions.RetrieveAtLoad ]);
    console.log("Received the value of settings:", settings);
    return {
        retrieveAtLoad: SettingsOptions.RetrieveAtLoad in settings ? settings[SettingsOptions.RetrieveAtLoad] : true
    };
});

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        retrieveAtLoad: true,
        status: ThunkState.Idle
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleRetrieveAtLoad.fulfilled, (state, action) => {
                state.retrieveAtLoad = action.payload;
            })
            .addCase(fetchSettings.fulfilled, (state, action: { payload: any }) => {
                state.retrieveAtLoad = action.payload.retrieveAtLoad;
                state.status = ThunkState.Success;
            })
            .addCase(fetchSettings.rejected, (state, action: { payload: any }) => {
                if (process.env.NODE_ENV == "development") {
                    state.retrieveAtLoad = false;
                    state.status = ThunkState.Success;
                    console.error(action.payload);
                    return;
                }
                state.status = ThunkState.Failed;
                console.error(action.payload);
            })
    }
});

export const selectRetrieveAtLoad = (state: RootState) => state.settings.retrieveAtLoad;

export const selectSettingsState = (state: RootState) => state.settings.status;

export default settingsSlice.reducer;

