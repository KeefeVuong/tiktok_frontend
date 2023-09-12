import { React, useState, useEffect, useRef } from 'react'
import { Dialog } from '@mui/material';
import Video from "../components/Video"
import Navbar from "../components/Navbar"
import { useParams } from 'react-router-dom';
import { APIFetch } from "../Helper.jsx"
import { Editor } from '@tinymce/tinymce-react';

function WeeklyReport() {
  const [tiktoks, setTiktoks] = useState([])
  const [openWeeklyNotes, setOpenWeeklyNotes] = useState(false)

  const params = useParams();

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
    </>
  )
}

export default WeeklyReport