import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import settingsReducer from './settingsSlice'
import dataReducer from './dataSlice'
import feedbackReducer from './feedbackSlice'
import historyReducer from './historySlice'


export default configureStore({
    reducer: {
        settings: settingsReducer,
        data: dataReducer,
        feedback: feedbackReducer,
        history: historyReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
});
