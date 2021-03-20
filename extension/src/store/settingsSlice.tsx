import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './storeInterfaces';


export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        retrieveAtLoad: true
    },
    reducers: {
        toggleRetrieveAtLoad: state => {
            state.retrieveAtLoad = !state.retrieveAtLoad;
        }
    }
});

export const { toggleRetrieveAtLoad } = settingsSlice.actions;

export const selectRetrieveAtLoad = (state: RootState) => state.settings.retrieveAtLoad;

export default settingsSlice.reducer;

