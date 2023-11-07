import { React, useState } from 'react'
import { Box, IconButton, TextField, Typography, Divider, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Autosave, useAutosave } from 'react-autosave';
import { APIFetch, renderImprovements } from "../Helper.jsx"
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteTiktokForm from "./DeleteTiktokForm";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const tiktok_stats_style = {
  height:"375px", 
  backgroundColor: "#FADADD",
  border: "1px solid #f2e6e8",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "200px"
}

function Video( {tiktoks, getTiktoks, handleSnackbar, editMode} ) {

  const [notes, setNotes] = useState({})
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
  const [toDelete, setToDelete] = useState("")

  const handleNotes = (tiktokID, type, newNote) => {
    let updatedNotes = { ...notes };
    if (updatedNotes[tiktokID] === undefined) {
      updatedNotes[tiktokID] = {}
    }
    updatedNotes[tiktokID][type] = newNote;
    setNotes(updatedNotes);
  }

  const updateNotes = async () => {
    for (let tiktokId in notes) {
        await APIFetch(`/api/tiktoks/${tiktokId}`, "PUT", notes[tiktokId])
        .catch((e) => {
          console.error(e.message)
          handleSnackbar(true, "ERROR: Saved Notes")
        })
    }
    if (Object.keys(notes).length !== 0) {
      handleSnackbar(true, "SUCCESS: Saved Notes")
      setNotes({})
    }

  }
  
  useAutosave({ data: notes, onSave: updateNotes, interval: 1000 });

  return (
    <>
    {/* <Box component="h2" sx={{display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat", fontWeight: "normal", backgroundColor: "#FFD8BE", padding: "0.83em", margin: "0"}}>
      <AssessmentIcon sx={{paddingRight: "0.3rem"}}/>
      Weekly Report for {title}
    </Box> */}
    <Divider/>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{backgroundColor: "#FFD8BE"}}>
            <TableCell width="10%">
            <Box sx={{"display": "flex", "alignItems": "center", "justifyContent": "space-between"}}>
              <Typography component="h1"><Box component="span" fontWeight="bold">Tiktok Thumbnail</Box></Typography>
              </Box>
            </TableCell>
            <TableCell width="10%">
              <Box sx={{"display": "flex", "alignItems": "center", "justifyContent": "space-between"}}>
              <Typography component="h1"><Box component="span" fontWeight="bold">Tiktok Statistics</Box></Typography>
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{"display": "flex", "alignItems": "center", "justifyContent": "space-between"}}>
                <Typography component="h1"><Box component="span" fontWeight="bold">Additional Notes</Box></Typography>
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
                  height="375px"
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
                    <br/>
                    <Box> <Box fontWeight={"bold"} component="span">{((tiktok.like_count + tiktok.comment_count +tiktok.share_count) / tiktok.view_count).toFixed(2)}%</Box> Engagement</Box>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box>

                  <TextField
                  label={tiktok.id in notes ? "Saving" : "Hook"}
                  multiline
                  fullWidth
                  rows={1}
                  size="small"
                  defaultValue={tiktok.hook}
                  onChange={(e) => handleNotes(tiktok.id, "hook", e.target.value)}
                  sx={{marginBottom: "20px"}}
                  />
              
                  <TextField
                  multiline
                  rows={5}
                  fullWidth
                  defaultValue={tiktok.notes}
                  label={tiktok.id in notes ? "Saving" : "Notes"}
                  onChange={(e) => handleNotes(tiktok.id, "notes", e.target.value)}
                  sx={{color: "#f5ebed", marginBottom: "20px"}}
                  />

                  <TextField
                  multiline
                  rows={5}
                  fullWidth
                  sx={{color: "#f5ebed"}}
                  defaultValue={tiktok.improvements}
                  label={tiktok.id in notes ? "Saving" : "Improvements"}
                  onChange={(e) => handleNotes(tiktok.id, "improvements", e.target.value)}
                  />
                </Box>
              </TableCell>
              <TableCell sx={{position: 'absolute', right: "0.2rem", marginTop: "0.34rem"}}>
                {
                  editMode &&
                  <Box sx={{display: "flex", justifyContent: "center", backgroundColor: "#ffd8be", borderRadius: "2rem"}}>
                    {tiktok.order > 0 &&
                      <IconButton size="small" onClick={async () => {await APIFetch(`/api/tiktoks/${tiktok.id}`, 'PUT', {order: tiktok.order - 1}); getTiktoks()}}>
                        <KeyboardArrowDownIcon size="small" sx={{color: "#de8590"}}/>
                      </IconButton>
                    }
                    {tiktok.order < tiktoks.length &&
                      <IconButton size="small" onClick={async () => {await APIFetch(`/api/tiktoks/${tiktok.id}`, 'PUT', {order: tiktok.order + 1}); getTiktoks()}}>
                        <KeyboardArrowUpIcon size="small" sx={{color: "#de8590"}}/>
                      </IconButton>
                    }
                    <IconButton size="small" onClick={() => {setOpenDeleteConfirmation(!openDeleteConfirmation); setToDelete(tiktok.id)}}>
                      <DeleteIcon size="small" sx={{color: "#de8590"}}/>
                    </IconButton>
                  
                  </Box>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <DeleteTiktokForm
    openDeleteConfirmation={openDeleteConfirmation}
    setOpenDeleteConfirmation={setOpenDeleteConfirmation}
    toDelete={toDelete}
    getTiktoks={getTiktoks}
    handleSnackbar={handleSnackbar}
    />
    </>
  )
}

export default Video