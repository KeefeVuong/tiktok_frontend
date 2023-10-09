import { React, useState, useEffect, useRef } from 'react'
import { Dialog, Fab } from '@mui/material';
import Video from "../components/Video"
import Navbar from "../components/Navbar"
import { useParams } from 'react-router-dom';
import { APIFetch } from "../Helper.jsx"
import { Editor } from '@tinymce/tinymce-react';
import AddIcon from '@mui/icons-material/Add';
import AddTiktokForm from '../components/AddTiktokForm';

function WeeklyReport({handleSnackbar}) {
  const params = useParams();

  const [tiktoks, setTiktoks] = useState([])
  const [openWeeklyNotes, setOpenWeeklyNotes] = useState(false)
  const [openAddTiktok, setOpenAddTiktok] = useState(false)

  const handleAddTiktok = () => {
    setOpenAddTiktok(!openAddTiktok)
  }

  const getTiktoks = async () => {
    await APIFetch(`/api/weekly-reports/${params.id}`, "GET")
    .then((tiktokData) => setTiktoks(tiktokData.reverse()))
    .catch((e) => {
      console.error(e.message)
      handleSnackbar(true, "ERROR: Get Tiktok Data")
    })
  }

  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  useEffect(() => {
    getTiktoks()

  }, [])

  return (
    <>
      <Navbar tiktoks={tiktoks} getTiktoks={getTiktoks}/>
      <Video tiktoks={tiktoks} getTiktoks={getTiktoks} setOpenWeeklyNotes={setOpenWeeklyNotes} handleSnackbar={handleSnackbar}/>
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

      <AddTiktokForm
      openAddTiktok={openAddTiktok}
      handleAddTiktok={handleAddTiktok}
      getTiktoks={getTiktoks}
      />
    </>
  )
}

export default WeeklyReport