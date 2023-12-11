import { React } from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { APIFetch } from '../Helper';

function DeleteVideoForm({openDeleteConfirmation, setOpenDeleteConfirmation, toDelete, getVideos, handleSnackbar}) {

    const deleteVideo = async () => {
        setOpenDeleteConfirmation(!openDeleteConfirmation)
        await APIFetch(`/api/tiktoks/${toDelete}`, "DELETE")
        .then(() => {
            getVideos()
            handleSnackbar(true, "SUCCESS: Delete Tiktok")
        })
        .catch((e) => {
            console.error(e.message)
            handleSnackbar(true, "ERROR: Delete Tiktok")
        })
    }

    return (
        <Dialog
        open={openDeleteConfirmation}
        onClose={() => setOpenDeleteConfirmation(false)}
        >
        <DialogTitle>
            {"Delete selected video?"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText >
            By confirming to DELETE, you must be aware that ALL data will be lost
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenDeleteConfirmation(false)}>Cancel</Button>
            <Button onClick={deleteVideo} autoFocus>
            Delete
            </Button>
        </DialogActions>
        </Dialog>

    )
}

export default DeleteVideoForm