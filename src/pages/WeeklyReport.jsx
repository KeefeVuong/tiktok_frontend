import { React, useState, useEffect, useRef } from 'react'
import { Dialog, Fab, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import Video from "../components/Video"
import Navbar from "../components/Navbar"
import { useParams, useNavigate } from 'react-router-dom';
import { APIFetch } from "../Helper.jsx"
import { Editor } from '@tinymce/tinymce-react';
import AddIcon from '@mui/icons-material/Add';


function WeeklyReport() {
  const [tiktoks, setTiktoks] = useState([])
  const [openWeeklyNotes, setOpenWeeklyNotes] = useState(false)
  const [openAddTiktok, setOpenAddTiktok] = useState(false)
  const [addTiktokUrl, setAddTiktokUrl] = useState("")
  const params = useParams();
  const navigate = useNavigate()

  const handleAddTiktok = () => {
    setOpenAddTiktok(!openAddTiktok)
  }

  const addTiktok = async () => {
    const body = {
      "weekly_report": params.id,
      "url": addTiktokUrl
    }
    await APIFetch('/api/tiktoks/', 'POST', body)
    handleAddTiktok()
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
      <Video tiktoks={tiktoks} setOpenWeeklyNotes={setOpenWeeklyNotes}/>
      <Fab onClick={handleAddTiktok} sx={{position: "fixed", bottom: "2%", right: "0.5%", backgroundColor: "#de8590", ".hover": {"backgroundColor": "#de8590"}}}>
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
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Video URL"
            type="link"
            onChange={(e) => {setAddTiktokUrl(e.target.value)}}
            fullWidth
            variant="standard"
          />
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