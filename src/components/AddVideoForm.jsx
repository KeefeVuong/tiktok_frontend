import { React, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';

const addVideoFormCountStyle = {
    display: "flex",
    justifyContent: "space-around",
    gap: "10%"
}

function AddVideoForm({openAddVideo, handleAddVideo, getVideos, handleSnackbar}) {
    const params = useParams();

    const [imagePreview, setImagePreview] = useState(null);
    const [addVideoForm, setAddVideoForm] = useState({
        weekly_report: params.id,
        url: null,
        like_count: null,
        view_count: null,
        comment_count: null,
        favourite_count: null,
        thumbnail: null
    });

    const addVideo = async () => {
        if (!Object.values(addVideoForm).every(value => value !== null)) {
            handleSnackbar(true, "ERROR: Please ensure all fields are filled out")
            return;
        }

        const formData = new FormData();
        formData.append('thumbnail', addVideoForm["thumbnail"]);
        formData.append("weekly_report", addVideoForm["weekly_report"])
        formData.append("url", addVideoForm["url"])
        formData.append("like_count", addVideoForm["like_count"])
        formData.append("view_count", addVideoForm["view_count"])
        formData.append("comment_count", addVideoForm["comment_count"])
        formData.append("favourite_count", addVideoForm["favourite_count"])

        handleAddVideo();
        fetch('https://keefe-tk-be.xyz/api/tiktoks/', {
            method: 'POST',
            headers: {
                'Authorization': `${localStorage.getItem("token")}`,
            },
            body: formData,
        })
        .then(() => {
            getVideos();
            setImagePreview(null)
            setAddVideoForm({
                weekly_report: params.id,
                url: null,
                like_count: null,
                view_count: null,
                comment_count: null,
                favourite_count: null,
                thumbnail: null
            })
        })
        .catch((e) => {
            console.error(e.message)
            handleSnackbar(true, "ERROR: Add Tiktok")
        })
    }

    const changeaddVideoDetails = (e) => {
        const {name, value} = e.target;
        
        setAddVideoForm({
          ...addVideoForm,
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
        <Dialog open={openAddVideo} onClose={handleAddVideo}>
            <DialogTitle>Manually Add Tiktok</DialogTitle>
            <Divider/>
            <DialogContent>
            <DialogContentText>
                
            </DialogContentText>
            <Box sx={{display: "flex", flexDirection: "column", "alignItems": "center"}}>
                {imagePreview !== null && 
                <img src={imagePreview} height="375px" width= "200px" border="1px solid black"/>}
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
                    onChange={changeaddVideoDetails}
                    />
                </Button>
            </Box>
            <TextField
                autoFocus
                margin="dense"
                label="Video URL"
                name="url"
                fullWidth
                onChange={changeaddVideoDetails}
                variant="standard"
            />
            <Box sx={addVideoFormCountStyle}>
                <TextField
                autoFocus
                margin="dense"
                label="View Count"
                type="number"
                name="view_count"
                onChange={changeaddVideoDetails}
                variant="standard"
                />
                <TextField
                autoFocus
                margin="dense"
                label="Like Count"
                name="like_count"
                type="number"
                onChange={changeaddVideoDetails}
                variant="standard"
                />

            </Box>
            <Box sx={addVideoFormCountStyle}>
                <TextField
                autoFocus
                margin="dense"
                label="Comment Count"
                name="comment_count"
                type="number"
                onChange={changeaddVideoDetails}
                variant="standard"
                />
                <TextField
                autoFocus
                margin="dense"
                label="Favourite Count"
                name="favourite_count"
                type="number"
                onChange={changeaddVideoDetails}
                variant="standard"
                />
            </Box>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleAddVideo}>Cancel</Button>
            <Button onClick={addVideo}>Add Tiktok</Button>
            </DialogActions>
        </Dialog>
    )
}

export default AddVideoForm