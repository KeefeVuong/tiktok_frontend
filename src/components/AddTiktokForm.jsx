import { React, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { APIFetch } from "../Helper.jsx"

const addTiktokFormCountStyle = {
    display: "flex",
    justifyContent: "space-around",
    gap: "10%"
}

function AddTiktokForm({openAddTiktok, handleAddTiktok, getTiktoks, handleSnackbar}) {
    const params = useParams();

    const [addTiktokForm, setAddTiktokForm] = useState({
        weekly_report: params.id,
        url: "",
        like_count: 0,
        view_count: 0,
        comment_count: 0,
        favourite_count: 0,
    });

    const addTiktok = async () => {
        handleAddTiktok()
        await APIFetch('/api/tiktoks/', 'POST', addTiktokForm)
        .then(() => getTiktoks())
        .catch((e) => {
          console.error(e.message)
          handleSnackbar(true, "ERROR: Add Tiktok")
        })
    }

    const changeAddTiktokDetails = (e) => {
        const {name, value} = e.target;
    
        setAddTiktokForm({
          ...addTiktokForm,
          [name]: value,
        })
    }
    

    return (
        <Dialog open={openAddTiktok} onClose={handleAddTiktok}>
            <DialogTitle>Manually Add Tiktok</DialogTitle>
            <DialogContent>
            <DialogContentText>
                
            </DialogContentText>
            {/* <Button
                variant="contained"
                component="label"
            >
                Upload Thumbnail
                <input
                type="file"
                hidden
                name="thumbnail"
                onChange={changeAddTiktokDetails}
                />
            </Button> */}
            <TextField
                autoFocus
                margin="dense"
                label="Video URL"
                name="url"
                fullWidth
                onChange={changeAddTiktokDetails}
                variant="standard"
            />
            <Box sx={addTiktokFormCountStyle}>
                <TextField
                autoFocus
                margin="dense"
                label="View Count"
                type="number"
                name="view_count"
                onChange={changeAddTiktokDetails}
                variant="standard"
                />
                <TextField
                autoFocus
                margin="dense"
                label="Like Count"
                name="like_count"
                type="number"
                onChange={changeAddTiktokDetails}
                variant="standard"
                />

            </Box>
            <Box sx={addTiktokFormCountStyle}>
                <TextField
                autoFocus
                margin="dense"
                label="Comment Count"
                name="comment_count"
                type="number"
                onChange={changeAddTiktokDetails}
                variant="standard"
                />
                <TextField
                autoFocus
                margin="dense"
                label="Favourite Count"
                name="favourite_count"
                type="number"
                onChange={changeAddTiktokDetails}
                variant="standard"
                />
            </Box>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleAddTiktok}>Cancel</Button>
            <Button onClick={addTiktok}>Add Tiktok</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddTiktokForm