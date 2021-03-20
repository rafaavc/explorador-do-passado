import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from './settingsSlice'
import dataReducer from './dataSlice'

export default configureStore({
    reducer: {
        settings: settingsReducer,
        data: dataReducer
    }
});
