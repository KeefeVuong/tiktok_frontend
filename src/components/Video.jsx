import { React, useState, useEffect } from 'react'
import { Box, Button, TextField, Typography, Skeleton, Fab} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Autosave, useAutosave } from 'react-autosave';
import { APIFetch, renderImprovements } from "../helper.jsx"
import Snackbar from "./Snackbar"
import SaveIcon from '@mui/icons-material/Save';

const tiktok_stats_style = {
  height:"350px", 
  backgroundColor: "#f5ebed", 
  border: "1px solid #f2e6e8",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
}

function Video( {tiktoks, setOpenWeeklyNotes} ) {

  const [notes, setNotes] = useState({})
  const [openSnackbar, setOpenSnackbar] = useState(false)

  const updateNotes = async () => {
    for (let tiktokId in notes) {
      await APIFetch(`/api/tiktoks/${tiktokId}`, "PUT", { "notes": notes[tiktokId] })
    }
    if (Object.keys(notes).length !== 0) {
      setOpenSnackbar(true)
      setNotes({})
    }

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
            <TableCell sx={{display: "flex", justifyContent: "space-between"}}>
              <Typography component="h2"><Box component="span" fontWeight="bold">Additional Notes</Box></Typography>
              {/* <Button onClick={() => {setOpenWeeklyNotes(true)}}>Test</Button> */}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tiktoks.reverse().map((tiktok) => (
            <TableRow
              key={tiktok.id}
            >
              <TableCell>
                <img 
                alt="tiktok thumbnail" 
                src={tiktok.thumbnail}
                height="350px"
                width="200px"
                />
              </TableCell>
              <TableCell>
                <Box fontSize="17px" sx={tiktok_stats_style}>
                  <Box>
                    <Box>{renderImprovements(tiktok.view_count, tiktok.improvement_view_count, tiktok.last_updated, true, "Views")}</Box>
                    <Box>{renderImprovements(tiktok.like_count, tiktok.improvement_like_count, tiktok.last_updated, true, "Likes")}</Box>
                    <Box>{renderImprovements(tiktok.comment_count, tiktok.improvement_comment_count, tiktok.last_updated, true, "Comments")}</Box>
                    {/* <Box>{renderImprovements(tiktok.favourite_count, tiktok.improvement_favourite_count, tiktok.last_updated, true, "Favourites")}</Box> */}
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <TextField
                multiline
                rows={14}
                fullWidth
                sx={{color: "#f5ebed"}}
                defaultValue={tiktok.notes}
                label={tiktok.id in notes ? "Saving" : ""}
                onChange={(e) => {
                  const updatedNotes = { ...notes };
                  updatedNotes[tiktok.id] = e.target.value;
                  setNotes(updatedNotes);
                }}
                />
              </TableCell>
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
    <Snackbar open={openSnackbar} setOpen={setOpenSnackbar} message="SUCCESS: Saved Notes"/>
    </>
  )
}

export default Video