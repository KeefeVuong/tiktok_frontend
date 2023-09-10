import React from 'react'
import { Box, Button, TextField } from '@mui/material';
import Video from "./Video.jsx"

const video_style = {
    height: "100%",
    width: "100%",
    border: "1px solid black",
}

function VideoData() {
  return (
    <Box sx={video_style}>
      <Video></Video>
    </Box>
  )
}

export default VideoData