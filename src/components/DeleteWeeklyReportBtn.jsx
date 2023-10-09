import { React, useState } from 'react'
import { Button, Fab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function DeleteWeeklyReportBtn({selected, deleteWeeklyReports}) {

    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
    const handleDeleteConfirmation = () => {
        setOpenDeleteConfirmation(!openDeleteConfirmation)
    }

    return (
        <>
            {selected && selected.length > 0 &&
            <>
                <Fab onClick={() => setOpenDeleteConfirmation(true)} color="error" sx={{position: "fixed", bottom: "7%", right: "1%"}}>
                    <DeleteIcon/>
                </Fab>
            </>
            }

            <Dialog
            open={openDeleteConfirmation}
            onClose={handleDeleteConfirmation}
            >
                <DialogTitle>
                    {"Delete selected weekly reports?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText >
                    By confirming to DELETE, you must be aware that ALL data will be lost
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteConfirmation}>Cancel</Button>
                    <Button onClick={() => {handleDeleteConfirmation(); deleteWeeklyReports()}} autoFocus>
                    Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteWeeklyReportBtn