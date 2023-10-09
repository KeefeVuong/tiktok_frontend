import React from 'react'
import { Typography, Backdrop, CircularProgress } from '@mui/material';

function LoadingBackdrop( {loading} ) {
    return (
        <Backdrop
        sx={{ display: "flex", flexDirection: "column", color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        >
            <CircularProgress color="inherit" sx={{marginBottom: "17px"}}/>
            <Typography>Loading Weekly Reports...</Typography>
            <Typography>Please wait :)</Typography>
      </Backdrop>
    )
}

export default LoadingBackdrop