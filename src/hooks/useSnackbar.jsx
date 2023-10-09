import { React, useState, useEffect } from 'react';


function useSnackbar() {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ""
    })

    const handleSnackbar = (open, message) => {
        setSnackbar({
            ...setSnackbar,
            ["open"]: open,
            ["message"]: message
        })
    }

    return {snackbar, handleSnackbar}
}

export default useSnackbar