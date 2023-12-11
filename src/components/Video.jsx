import { React, useState, useRef } from 'react'
import { Box, IconButton, TextField, Typography, Divider, Button, Hidden } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Autosave, useAutosave } from 'react-autosave';
import { APIFetch, renderImprovements } from "../Helper.jsx"
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteVideoForm from "./DeleteVideoForm";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link as ScrollLink, scroller, animateScroll } from 'react-scroll';

const video_stats_style = {
  height:"375px", 
  backgroundColor: "#FADADD",
  border: "1px solid #f2e6e8",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "200px"
}

function Video( {videos, getVideos, handleSnackbar, editMode} ) {

  const [notes, setNotes] = useState({})
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)
  const [toDelete, setToDelete] = useState("")

  const handleNotes = (videoID, type, newNote) => {
    let updatedNotes = { ...notes };
    if (updatedNotes[videoID] === undefined) {
      updatedNotes[videoID] = {}
    }
    updatedNotes[videoID][type] = newNote;
    setNotes(updatedNotes);
  }

  const updateNotes = async () => {
    for (let videoId in notes) {
        await APIFetch(`/api/videos/${videoId}`, "PUT", notes[videoId])
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

  const movevideo = async (video, direction) => {
    await APIFetch(`/api/videos/${video.id}`, 'PUT', {order: direction === "up" ? video.order + 1 : video.order - 1}); 
    await getVideos();

    animateScroll.scrollMore(direction === "up" ? -410 : 410);
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
              <Typography component="h1"><Box component="span" fontWeight="bold">Video Thumbnail</Box></Typography>
              </Box>
            </TableCell>
            <TableCell width="10%">
              <Box sx={{"display": "flex", "alignItems": "center", "justifyContent": "space-between"}}>
              <Typography component="h1"><Box component="span" fontWeight="bold">Video Statistics</Box></Typography>
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
          {videos.map((video) => (
            <TableRow
              key={video.id}
            >
              <TableCell>
                <a href={video.url} target="_blank">
                  <img 
                  alt="video thumbnail" 
                  src={video.thumbnail}
                  height="375px"
                  width="200px"
                  />
                </a>
              </TableCell>
              <TableCell>
                <Box fontSize="17px" sx={video_stats_style}>
                  <Box>
                    <Box>{renderImprovements(video.view_count, video.improvement_view_count, video.last_updated, true, "Views")}</Box>
                    <Box>{renderImprovements(video.like_count, video.improvement_like_count, video.last_updated, true, "Likes")}</Box>
                    <Box>{renderImprovements(video.comment_count, video.improvement_comment_count, video.last_updated, true, "Comments")}</Box>
                    <Box>{renderImprovements(video.favourite_count, video.improvement_favourite_count, video.last_updated, true, "Favourites")}</Box>
                    <br/>
                    <Box> <Box fontWeight={"bold"} component="span">{((video.like_count + video.comment_count +video.share_count) / video.view_count).toFixed(2)}%</Box> Engagement</Box>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box>

                  <TextField
                  label={video.id in notes ? "Saving" : "Hook"}
                  multiline
                  fullWidth
                  rows={1}
                  size="small"
                  defaultValue={video.hook}
                  onChange={(e) => handleNotes(video.id, "hook", e.target.value)}
                  sx={{marginBottom: "20px"}}
                  />
              
                  <TextField
                  multiline
                  rows={5}
                  fullWidth
                  defaultValue={video.notes}
                  label={video.id in notes ? "Saving" : "Notes"}
                  onChange={(e) => handleNotes(video.id, "notes", e.target.value)}
                  sx={{color: "#f5ebed", marginBottom: "20px"}}
                  />

                  <TextField
                  multiline
                  rows={5}
                  fullWidth
                  sx={{color: "#f5ebed"}}
                  defaultValue={video.improvements}
                  label={video.id in notes ? "Saving" : "Improvements"}
                  onChange={(e) => handleNotes(video.id, "improvements", e.target.value)}
                  />
                </Box>
              </TableCell>
              {
                editMode &&
                <TableCell sx={{position: 'absolute', right: "0.2rem", marginTop: "0.34rem"}}>
                    <Box sx={{display: "flex", justifyContent: "center", backgroundColor: "#ffd8be", borderRadius: "2rem"}}>
                        <IconButton id={`${video.id}-down`} size="small" onClick={() => {movevideo(video, "down")}} disabled={!(video.order > 0)}>
                          <KeyboardArrowDownIcon size="small" sx={{color: (theme) => (!(video.order > 0) ? theme.palette.text.disabled : '#de8590')}}/>
                        </IconButton>
                      <IconButton size="small" onClick={() => {movevideo(video, "up")}} disabled={!(video.order < videos.length - 1)}>
                        <KeyboardArrowUpIcon size="small" sx={{color: (theme) => (!(video.order < videos.length - 1) ? theme.palette.text.disabled : '#de8590')}}/>
                      </IconButton>
                      
                      <IconButton size="small" onClick={() => {setOpenDeleteConfirmation(!openDeleteConfirmation); setToDelete(video.id)}}>
                        <DeleteIcon size="small" sx={{color: "#de8590"}}/>
                      </IconButton>
                    
                    </Box>
                </TableCell>
              }
          </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <DeleteVideoForm
    openDeleteConfirmation={openDeleteConfirmation}
    setOpenDeleteConfirmation={setOpenDeleteConfirmation}
    toDelete={toDelete}
    getVideos={getVideos}
    handleSnackbar={handleSnackbar}
    />
    </>
  )
}

export default Video