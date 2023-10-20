import { React, useState, useEffect, useRef } from 'react'
import { Drawer } from '@mui/material';
import Video from "../components/Video"
import Navbar from "../components/Navbar"
import { useParams } from 'react-router-dom';
import { APIFetch } from "../Helper.jsx"
import { Editor } from '@tinymce/tinymce-react';
import AddIcon from '@mui/icons-material/Add';
import AddTiktokForm from '../components/AddTiktokForm';

import { styled } from '@mui/material/styles';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import NotesIcon from '@mui/icons-material/Notes';

import { Autosave, useAutosave } from 'react-autosave';


const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'fixed',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2),
  },
}));

function WeeklyReport({handleSnackbar}) {
  const params = useParams();
  
  const [weeklyReport, setWeeklyReport] = useState({})
  const [tiktoks, setTiktoks] = useState([])
  const [openWeeklyNotes, setOpenWeeklyNotes] = useState(false)
  const [openAddTiktok, setOpenAddTiktok] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [weeklyNotes, setWeeklyNotes] = useState("")

  const handleEditMode = () => {
    setEditMode(!editMode)
  }

  const handleAddTiktok = () => {
    setOpenAddTiktok(!openAddTiktok)
  }

  const handleOpenWeeklyNotes = () => {
    setOpenWeeklyNotes(!openWeeklyNotes)
  }

  const actions = [
    { icon: <SpeedDialIcon/>, name: 'Add', onclick: handleAddTiktok },
    { icon: <NotesIcon/>, name: 'Weekly Notes', onclick: handleOpenWeeklyNotes },
    { icon: <EditIcon/>, name: 'Edit', onclick: handleEditMode },
  ];

  const updateWeeklyNotes = async () => {
    await APIFetch(`/api/weekly-reports/${params.id}`, "PUT", {"notes": weeklyNotes})
    .catch((e) => {
      console.error(e.message)
      handleSnackbar(true, "ERROR: Saved Weekly Notes")
    })
  
    if (weeklyNotes.length !== 0) {
      handleSnackbar(true, "SUCCESS: Saved Weekly Notes")
      let newWeeklyReport = {...weeklyReport}
      newWeeklyReport["notes"] = weeklyNotes
      setWeeklyReport(newWeeklyReport)
      setWeeklyNotes("")
    }

  }

  const getTiktoks = async () => {
    await APIFetch(`/api/weekly-reports/${params.id}`, "GET")
    .then((data) => {
      setTiktoks(data["tiktok"].reverse())
      setWeeklyReport(data["weekly_report"])
    })
    .catch((e) => {
      console.error(e.message)
      handleSnackbar(true, "ERROR: Get Tiktok Data")
    })
  }

  const editorRef = useRef(null);
 
  useAutosave({ data: weeklyNotes, onSave: updateWeeklyNotes, interval: 1000 });

  useEffect(() => {
    getTiktoks()

  }, [])

  return (
    <>
      <Navbar/>
      <Video tiktoks={tiktoks} getTiktoks={getTiktoks} handleSnackbar={handleSnackbar} editMode={editMode} title={weeklyReport["title"] !== undefined ? weeklyReport["title"] : "Loading..."}/>

      <StyledSpeedDial
          ariaLabel="SpeedDial"
          icon={<SpeedDialIcon/>}
          direction="up"
          FabProps={{
            sx: {
              backgroundColor: '#de8590',
              '&:hover': {
                backgroundColor: '#de8590',
              },
            }
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              sx={{
                color: action.name === "Edit" && editMode ? "#ffffff" : "#de8590", 
                backgroundColor: action.name === "Edit" && editMode ? "#de8590" : "#ffffff",
                '&:hover': {
                    backgroundColor: action.name === "Edit" && editMode ? "#de8590" : "#ffffff"
                }
              }}
              tooltipTitle={action.name}
              onClick={action.onclick}
            />
          ))}
      </StyledSpeedDial>

      <Drawer
      sx={{width: "30%"}}
      open={openWeeklyNotes}
      onClose={handleOpenWeeklyNotes}
      >
        <Editor
          id="5"
          onInit={(editor) => (editorRef.current = editor)}
          initialValue={weeklyReport !== undefined ? weeklyReport["notes"] : ""}
          onEditorChange={(val) => {setWeeklyNotes(val)}}
          init={{
            selector: 'textarea',
            height: "100%",
            width: "100%",
            menubar: true,
            plugins: [
              'table',
            ],
            toolbar: 'undo redo | formatselect | blocks fontfamily fontsize |' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | restoredraft | help | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
            content_style: 'body { font-family:Monsterrat; font-size:24pt }'
          }}
        />
      </Drawer>

        

      <AddTiktokForm
      openAddTiktok={openAddTiktok}
      handleAddTiktok={handleAddTiktok}
      getTiktoks={getTiktoks}
      />
    </>
  )
}

export default WeeklyReport