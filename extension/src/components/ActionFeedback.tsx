import { Snackbar, SnackbarContent } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { closeFeedback, selectFeedback } from '../store/feedbackSlice';

export const ActionFeedback = () => {
    const feedback = useSelector(selectFeedback);
    const dispatch = useDispatch();

    return <Snackbar open={feedback.open} autoHideDuration={3000} onClose={() => dispatch(closeFeedback())}>
        {/* <Alert onClose={() => setFeedbackOpen(false)} severity="success">  
            Success!
        </Alert> */}
        <SnackbarContent message={feedback.message}/>
    </Snackbar>
}


