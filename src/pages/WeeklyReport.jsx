import { React, useState, useEffect, useRef } from 'react'
import { Dialog, Fab, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, Box } from '@mui/material';
import Video from "../components/Video"
import Navbar from "../components/Navbar"
import { useParams, useNavigate } from 'react-router-dom';
import { APIFetch } from "../Helper.jsx"
import { Editor } from '@tinymce/tinymce-react';
import AddIcon from '@mui/icons-material/Add';

const addTiktokFormCountStyle = {
  display: "flex",
  justifyContent: "space-around",
  gap: "10%"
}

function WeeklyReport() {
  const [tiktoks, setTiktoks] = useState([])
  const [openWeeklyNotes, setOpenWeeklyNotes] = useState(false)
  const [openAddTiktok, setOpenAddTiktok] = useState(false)
  const params = useParams();
  const [addTiktokForm, setAddTiktokForm] = useState({
    weekly_report: params.id,
    url: "",
    like_count: 0,
    view_count: 0,
    comment_count: 0,
    favourite_count: 0,
  });
  const navigate = useNavigate()

  const handleAddTiktok = () => {
    setOpenAddTiktok(!openAddTiktok)
  }

  const addTiktok = async () => {
    // const body = {
    //   "weekly_report": params.id,
    //   "url": addTiktokUrl
    // }
    handleAddTiktok()
    await APIFetch('/api/tiktoks/', 'POST', addTiktokForm)
    getTiktoks()
  }

  const changeAddTiktokDetails = (e) => {
    const {name, value} = e.target;

  
    setAddTiktokForm({
      ...addTiktokForm,
      [name]: value,
    })
    
  }


  const getTiktoks = async () => {
    const tiktokData = (await APIFetch(`/api/weekly-reports/${params.id}`, "GET")).reverse()
    setTiktoks(tiktokData)
  }

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  const checkAuth = async () => {
    if (localStorage.getItem("token") !== null) {
      await APIFetch("/api/login/", "POST")
      .catch(() => {
          localStorage.removeItem("token")
          navigate("/login")
      })
    }
    else {
      navigate("/login")
    }
  }

  useEffect(() => {
    checkAuth()
    getTiktoks()

  }, [])

  return (
    <>
      <Navbar tiktoks={tiktoks} getTiktoks={getTiktoks}/>
      <Video tiktoks={tiktoks} getTiktoks={getTiktoks} setOpenWeeklyNotes={setOpenWeeklyNotes}/>
      <Fab onClick={handleAddTiktok} sx={{position: "fixed", bottom: "2%", right: "1%", backgroundColor: "#de8590", ".hover": {"backgroundColor": "#de8590"}}}>
            <AddIcon sx={{color: "white"}}/>
      </Fab>
      <Dialog
        open={openWeeklyNotes}
        onClose={() => {setOpenWeeklyNotes(!openWeeklyNotes)}}
        // TransitionComponent={Transition}
      >
        
        {/* <Editor
          id="5"
          init={{
            height: 500,
            menubar: true,
            plugins: [
              'table',
              'autosave'
            ],
            autosave_interval: '1s',
            autosave_restore_when_empty: true,
            toolbar: 'undo redo | formatselect | blocks fontfamily fontsize |' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | restoredraft | help | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
            content_style: 'body { font-family:Monsterrat; font-size:14px }'
          }}
        /> */}
      </Dialog>

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
    </>
  )
}

export default WeeklyReport