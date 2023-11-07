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
import LoadingBackdrop from '../components/LoadingBackdrop';
import WeeklyNotes from '../components/WeeklyNotes';


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
    setLoading(false)
  }


  useEffect(() => {
    getTiktoks()
  }, [])

  return (
    <>
      <Navbar/>
      <Video tiktoks={tiktoks} getTiktoks={getTiktoks} handleSnackbar={handleSnackbar} editMode={editMode}/>

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

      <WeeklyNotes
      openWeeklyNotes={openWeeklyNotes}
      handleOpenWeeklyNotes={handleOpenWeeklyNotes}
      weeklyReport={weeklyReport}
      setWeeklyReport={setWeeklyReport}
      handleSnackbar={handleSnackbar}
      />

        
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