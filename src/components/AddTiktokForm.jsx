import { React, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { APIFetch } from "../Helper.jsx"

const addTiktokFormCountStyle = {
    display: "flex",
    justifyContent: "space-around",
    gap: "10%"
}

function AddTiktokForm({openAddTiktok, handleAddTiktok, getTiktoks, handleSnackbar}) {
    const params = useParams();

    const [imagePreview, setImagePreview] = useState(null);
    const [addTiktokForm, setAddTiktokForm] = useState({
        weekly_report: params.id,
        url: "",
        like_count: 0,
        view_count: 0,
        comment_count: 0,
        favourite_count: 0,
        thumbnail: null
    });

    const addTiktok = async () => {

        const formData = new FormData();
        formData.append('thumbnail', addTiktokForm["thumbnail"]);
        formData.append("weekly_report", addTiktokForm["weekly_report"])
        formData.append("url", addTiktokForm["url"])
        formData.append("like_count", addTiktokForm["like_count"])
        formData.append("view_count", addTiktokForm["view_count"])
        formData.append("comment_count", addTiktokForm["comment_count"])
        formData.append("favourite_count", addTiktokForm["favourite_count"])

        handleAddTiktok();
        fetch('https://keefe-tk-be.xyz/api/tiktoks/', {
            method: 'POST',
            headers: {
                'Authorization': `${localStorage.getItem("token")}`,
            },
            body: formData,
        })
        .then(() => {
            getTiktoks();
            setImagePreview(null)
        })
        .catch((e) => {
            console.error(e.message)
            handleSnackbar(true, "ERROR: Add Tiktok")
        })
    }

    const changeAddTiktokDetails = (e) => {
        const {name, value} = e.target;
        
        setAddTiktokForm({
          ...addTiktokForm,
          [name]: name !== "thumbnail" ? value : (() => {
            const selectedFile = e.target.files[0]

            const reader = new FileReader();
            reader.onloadend = () => {
              setImagePreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
            return selectedFile
          })(),
        })
    }
    

    return (
        <Dialog open={openAddTiktok} onClose={handleAddTiktok}>
            <DialogTitle>Manually Add Tiktok</DialogTitle>
            <Divider/>
            <DialogContent>
            <DialogContentText>
                
            </DialogContentText>
            <Box sx={{display: "flex", flexDirection: "column", "alignItems": "center"}}>
                <img src={imagePreview} height="375px" width= "200px"/>
                <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    sx={{marginTop: "2rem"}}
                >
                    Upload Thumbnail
                    <input
                    type="file"
                    hidden
                    accept="image/*"
                    name="thumbnail"
                    onChange={changeAddTiktokDetails}
                    />
                </Button>
            </Box>
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