import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from './settingsSlice'
import dataReducer from './dataSlice'
import feedbackReducer from './feedbackSlice'

export default configureStore({
    reducer: {
        settings: settingsReducer,
        data: dataReducer,
        feedback: feedbackReducer
    }
});
