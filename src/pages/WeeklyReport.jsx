import { React, useState, useEffect, useRef } from 'react'
import { Drawer } from '@mui/material';
import Video from "../components/Video"
import Navbar from "../components/Navbar"
import { useParams } from 'react-router-dom';
import { APIFetch } from "../Helper.jsx"
import { Editor } from '@tinymce/tinymce-react';
import { styled } from '@mui/material/styles';
import AddTiktokForm from '../components/AddTiktokForm';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';
import NotesIcon from '@mui/icons-material/Notes';

import { Autosave, useAutosave } from 'react-autosave';
import LoadingBackdrop from '../components/LoadingBackdrop';


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
  
  const editorRef = useRef(null);
  // const weeklyNotes = useRef("");
  const [weeklyReport, setWeeklyReport] = useState({})
  const [tiktoks, setTiktoks] = useState([])
  const [openWeeklyNotes, setOpenWeeklyNotes] = useState(false)
  const [openAddTiktok, setOpenAddTiktok] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [weeklyNotes, setWeeklyNotes] = useState("")
  const [loading, setLoading] = useState(true)

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
    .then(() => {
      handleSnackbar(true, "SUCCESS: Saved Weekly Notes")

    })
    .catch((e) => {
      console.error(e.message)
      handleSnackbar(true, "ERROR: Saved Weekly Notes")
    })

  }

  const getTiktoks = async () => {
    await APIFetch(`/api/weekly-reports/${params.id}`, "GET")
    .then((data) => {
      setTiktoks(data["tiktok"])
      setWeeklyReport(data["weekly_report"])
    })
    .catch((e) => {
      console.error(e.message)
      handleSnackbar(true, "ERROR: Get Tiktok Data")
    })
    setLoading(false)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault(); // Prevent the browser's default save action
        updateWeeklyNotes(); // Call your custom save function
      }
    };

    const editor = tinymce.get('5'); // Get the TinyMCE editor instance

    const handleEditorBlur = () => {
      
      // Provide a custom message along with the generic confirmation message
      const confirmationMessage = 'You have unsaved changes.';

      // Display the confirmation message when the user leaves the page or unfocuses the editor
      window.addEventListener('beforeunload', (e) => {
        e.returnValue = confirmationMessage;
      });
      
    };

    if (editor) {
      editor.on('keydown', handleKeyDown); // Add the keydown event listener to the editor
      editor.on('blur', handleEditorBlur);
    }


    return () => {
      if (editor) {
        editor.off('keydown', handleKeyDown); 
        editor.off('blur', handleEditorBlur);
      }
    };
  }, [updateWeeklyNotes]);


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
          value={weeklyNotes}
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

        
      <LoadingBackdrop
      loading={loading}
      message="Loading Tiktok Data..."
      />
      <AddTiktokForm
      openAddTiktok={openAddTiktok}
      handleAddTiktok={handleAddTiktok}
      getTiktoks={getTiktoks}
      />
    </>
  )
}

export default WeeklyReport