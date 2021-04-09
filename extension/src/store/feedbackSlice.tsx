import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './storeInterfaces';

export const feedbackSlice = createSlice({
    name: 'feedback',
    initialState: {
        open: false,
        message: ""
    },
    reducers: {
        openFeedback: state => {
            state.open = true;
        },
        closeFeedback: state => {
            state.open = false;
        },
        setFeedbackMessage: (state, action) => {
            state.message = action.payload;
        },
        setFeedbackMessageAndOpen: (state, action) => {
            state.message = action.payload;
            state.open = true;
        }
    }
});

export const selectFeedback = (state: RootState) => state.feedback;

export const { openFeedback, closeFeedback, setFeedbackMessage, setFeedbackMessageAndOpen } = feedbackSlice.actions;

export default feedbackSlice.reducer;

