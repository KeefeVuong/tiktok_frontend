import React from 'react'
import { useState } from 'react'
import { Box, Button, TextField } from '@mui/material';

const search_style = {
    display: "flex",
    justifyContent: "space-around"
}

function Search() {
    const [number, setNumber] = useState(0)

    const search_videos = () => {
      console.log(number)
    }
  
    return (
      <>
        <Box sx={search_style}>
          <TextField
              id="standard-number"
              label="Number of videos"
              type="number"
              variant="standard"
              fullWidth
              onChange={(e) => {setNumber(e.target.value)}}
          />
          <Button variant="contained" onClick={() => {search_videos()}}>Search Videos</Button>
        </Box>
      </>
    )
}

export default Search