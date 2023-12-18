import React from 'react'
import { useState } from 'react'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SuccessSnackbar({ open, handleSnackbar, message }) {
    let colour = "success"
    if (message.includes("ERROR")) {
        colour = "error"
    }

    function handleClose() {
        handleSnackbar(false, message)
    }

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={colour} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}

export default SuccessSnackbar