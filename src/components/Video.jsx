import { React, useState, useEffect } from 'react'
import { Box, Button, IconButton, TextField, Typography, Switch, Fab, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Autosave, useAutosave } from 'react-autosave';
import { APIFetch, renderImprovements } from "../Helper.jsx"
import Snackbar from "./Snackbar"
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const tiktok_stats_style = {
  height:"350px", 
  backgroundColor: "#f5ebed", 
  border: "1px solid #f2e6e8",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
}

function Video( {tiktoks, getTiktoks, setOpenWeeklyNotes} ) {

  const [notes, setNotes] = useState({})
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
  const [toDelete, setToDelete] = useState("")

  const updateNotes = async () => {

    for (let tiktokId in notes) {
      await APIFetch(`/api/tiktoks/${tiktokId}`, "PUT", { "notes": notes[tiktokId]["notes"], "hook": notes[tiktokId]["hook"] })
    }
    if (Object.keys(notes).length !== 0) {
      setOpenSnackbar(true)
      setNotes({})
    }

  }

  const deleteTiktok = async () => {
    setOpenDeleteConfirmation(!openDeleteConfirmation)
    await APIFetch(`/api/tiktoks/${toDelete}`, "DELETE")
    getTiktoks()
  }

  useAutosave({ data: notes, onSave: updateNotes, interval: 1000 });

  return (
    <>
    <TableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell width="10%">
              <Typography component="h2"><Box component="span" fontWeight="bold">Tiktok Thumbnail</Box></Typography>
            </TableCell>
            <TableCell width="13%">
              <Typography component="h2"><Box component="span" fontWeight="bold">Tiktok Statistics</Box></Typography>
            </TableCell>
            <TableCell>
              <Box sx={{"display": "flex", "alignItems": "center", "justifyContent": "space-between"}}>
                <Typography component="h2"><Box component="span" fontWeight="bold">Additional Notes</Box></Typography>
                {/* <Button onClick={() => {setOpenWeeklyNotes(true)}}>Test</Button> */}
                <FormControlLabel control={<Switch onChange={() => {setEditMode(!editMode)}}/>} label="Edit Mode" />
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tiktoks.map((tiktok) => (
            <TableRow
              key={tiktok.id}
            >
              <TableCell>
                <a href={tiktok.url} target="_blank">
                  <img 
                  alt="tiktok thumbnail" 
                  src={tiktok.thumbnail}
                  height="350px"
                  width="200px"
                  />
                </a>
              </TableCell>
              <TableCell>
                <Box fontSize="17px" sx={tiktok_stats_style}>
                  <Box>
                    <Box>{renderImprovements(tiktok.view_count, tiktok.improvement_view_count, tiktok.last_updated, true, "Views")}</Box>
                    <Box>{renderImprovements(tiktok.like_count, tiktok.improvement_like_count, tiktok.last_updated, true, "Likes")}</Box>
                    <Box>{renderImprovements(tiktok.comment_count, tiktok.improvement_comment_count, tiktok.last_updated, true, "Comments")}</Box>
                    <Box>{renderImprovements(tiktok.favourite_count, tiktok.improvement_favourite_count, tiktok.last_updated, true, "Favourites")}</Box>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <TextField
                label={tiktok.id in notes ? "Saving" : "Hook"}
                multiline
                fullWidth
                rows={1}
                size="small"
                defaultValue={tiktok.hook}
                onChange={(e) => {
                  const updatedNotes = { ...notes };
                  if (updatedNotes[tiktok.id] === undefined) {
                    updatedNotes[tiktok.id] = {
                      "notes": "",
                      "hook": ""
                    }
                  }
                  updatedNotes[tiktok.id]["hook"] = e.target.value;
                  setNotes(updatedNotes);
                }}
                sx={{marginBottom: "20px"}}
                />
             
                <TextField
                multiline
                rows={11}
                fullWidth
                sx={{color: "#f5ebed"}}
                defaultValue={tiktok.notes}
                label={tiktok.id in notes ? "Saving" : "Notes"}
                onChange={(e) => {
                  const updatedNotes = { ...notes };
                  if (updatedNotes[tiktok.id] === undefined) {
                    updatedNotes[tiktok.id] = {
                      "notes": "",
                      "hook": ""
                    }
                  }
                  updatedNotes[tiktok.id]["notes"] = e.target.value;
                  setNotes(updatedNotes);
                }}
                />
              </TableCell>
              {
                editMode &&
                <IconButton onClick={() => {setOpenDeleteConfirmation(!openDeleteConfirmation); setToDelete(tiktok.id)}} sx={{position: 'absolute', right: 1, color: "#de8590"}}>
                  <DeleteIcon/>
                </IconButton>
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    {Object.keys(notes).length !== 0 &&
      <Fab onClick={updateNotes} color="primary" sx={{position: "fixed", bottom: 20, right: 20}}>
          <SaveIcon />
      </Fab>
    }

    <Dialog
      open={openDeleteConfirmation}
      onClose={() => setOpenDeleteConfirmation(false)}
    >
      <DialogTitle>
        {"Delete selected tiktok?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText >
          By confirming to DELETE, you must be aware that ALL data will be lost
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteConfirmation(false)}>Cancel</Button>
        <Button onClick={deleteTiktok} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>

    <Snackbar open={openSnackbar} setOpen={setOpenSnackbar} message="SUCCESS: Saved Notes"/>
    </>
  )
}

export default Video