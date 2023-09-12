import { React, useState, useEffect } from 'react'
import { Box, Button, Typography, Container, Link, Checkbox, Fab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { DataGrid, gridColumnGroupsLookupSelector } from '@mui/x-data-grid';
import { APIFetch, renderImprovements } from "../helper.jsx"
import Navbar from "../components/Navbar"
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useNavigate
} from 'react-router-dom';


function Home() {
  const navigate = useNavigate()
  const [weeklyReports, setWeeklyReports] = useState([])
  const [selected, setSelected] = useState([])
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false)

  const columns = [
      { 
        field: 'title', 
        width: 200,
        renderHeader: () => {
          return (
            <Typography fontWeight="bold">Title</Typography>
          )
        },
        renderCell: (params) => {
          const id = params.row.id
          const frag = `#weekly-report/${id}`
          return (
            <Link sx={{color: "#de8590", fontWeight: "bold"}} underline="none" href={frag}>{params.row.title}</Link>
          )
        }
      },
      { field: 'start_date', width: 150,
        renderHeader: () => {
          return (
            <Typography fontWeight="bold">Start Date</Typography>
          )
        }
      },
      { field: 'end_date', width: 150,
        renderHeader: () => {
          return (
            <Typography fontWeight="bold">End Date</Typography>
          )
        }
      },
      { field: 'total_views', width: 150,
        renderHeader: () => {
          return (
            <Typography fontWeight="bold">Total Views</Typography>
          )
        }, 
        renderCell: (params) => {
          return renderImprovements(params.row.total_views, params.row.total_improvement_views, params.row.last_updated)
        }
      },
      { field: 'total_likes', width: 150, 
        renderHeader: () => {
          return (
            <Typography fontWeight="bold">Total Likes</Typography>
          )
        },
        renderCell: (params) => {
          return renderImprovements(params.row.total_likes, params.row.total_improvement_likes, params.row.last_updated)
        }
    },
      { field: 'total_comments', width: 185, 
        renderHeader: () => {
          return (
            <Typography fontWeight="bold">Total Comments</Typography>
          )
        },
        renderCell: (params) => {
          return renderImprovements(params.row.total_comments, params.row.total_improvement_comments, params.row.last_updated)
        }
    },
    //   { field: 'total_favourites', width:185, 
    //     renderHeader: () => {
    //       return (
    //         <Typography fontWeight="bold">Total Favourites</Typography>
    //       )
    //     },
    //     renderCell: (params) => {
    //       return renderImprovements(params.row.total_favourites, params.row.total_improvement_favourites, params.row.last_updated)
    //     }
    // },
      { field: 'last_updated', width:175,
      renderHeader: () => {
        return (
          <Typography fontWeight="bold">Last Updated</Typography>
        )
      }
    },
  ];

  const deleteWeeklyReports = async () => {
    await APIFetch("/api/weekly-reports/", "DELETE", { ids: selected })
    getWeeklyReports()
    setOpenDeleteConfirmation(false)
  }

  const getWeeklyReports = async () => {
    const weeklyReportData = await APIFetch("/api/weekly-reports/", "GET")
    setWeeklyReports(weeklyReportData)
    setSelected([])
  }

  const checkAuth = async () => {
    if (localStorage.getItem("token") !== null) {
      await APIFetch("/api/login/", "POST")
      .catch(() => {
          navigate("/login")
      })
    }
    else {
      navigate("/login")
    }
  }

  useEffect(() => {
    checkAuth()
    getWeeklyReports()
  }, [])
  return (
    <>
    <Navbar weeklyReports={weeklyReports} getWeeklyReports={getWeeklyReports} selected={selected}/>
    <Box sx={{height: "calc(100vh - 65px)"}}>
        <DataGrid
        sx={{border: 0}}
        rows={weeklyReports}
        columns={columns}
        checkboxSelection 
        disableRowSelectionOnClick
        rowSelectionModel={selected}
        onRowSelectionModelChange={(newselected) => {
          setSelected(newselected);
        }}
        autoPageSize
        // initialState={{
        //     pagination: { paginationModel: { pageSize: 10 } },
        //     sorting: {
        //       sortModel: [{ field: 'date', sort: 'desc' }],
        //     },
        // }}
        // pageSizeOptions={[10, 20, 25]}
        />
    </Box>
    {selected && selected.length > 0 &&
    <>
        <Fab onClick={() => setOpenDeleteConfirmation(true)} color="error" sx={{position: "fixed", bottom: "7%", right: "1%"}}>
            <DeleteIcon/>
        </Fab>
    </>
    }

    <Dialog
      open={openDeleteConfirmation}
      onClose={() => setOpenDeleteConfirmation(false)}
    >
      <DialogTitle>
        {"Delete selected weekly reports?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText >
          By confirming to DELETE, you must be aware that ALL data will be lost
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteConfirmation(false)}>Cancel</Button>
        <Button onClick={deleteWeeklyReports} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </>
  )
}

export default Home