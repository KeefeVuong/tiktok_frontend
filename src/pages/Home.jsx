import { React, useState, useEffect } from 'react'
import { Box, Button, Typography, Skeleton, Link, Backdrop, CircularProgress, Fab, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { DataGrid, gridColumnGroupsLookupSelector } from '@mui/x-data-grid';
import { APIFetch, renderImprovements } from "../Helper.jsx"
import Navbar from "../components/Navbar"
import DeleteIcon from '@mui/icons-material/Delete';



function Home() {
  const [weeklyReports, setWeeklyReports] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
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
          if (params.row.last_updated === "loading") {
            return <Skeleton animation="wave" width="100%" />
          }
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
        },
        renderCell: (params) => {
          if (params.row.last_updated === "loading") {
            return <Skeleton animation="wave" width="100%" />
          }
        }
      },
      { field: 'end_date', width: 150,
        renderHeader: () => {
          return (
            <Typography fontWeight="bold">End Date</Typography>
          )
        },
        renderCell: (params) => {
          if (params.row.last_updated === "loading") {
            return <Skeleton animation="wave" width="100%" />
          }
        }
      },
      { field: 'total_views', width: 150,
        renderHeader: () => {
          return (
            <Typography fontWeight="bold">Total Views</Typography>
          )
        }, 
        renderCell: (params) => {
          if (params.row.last_updated === "loading") {
            return <Skeleton animation="wave" width="100%" />
          }
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
          if (params.row.last_updated === "loading") {
            return <Skeleton animation="wave" width="100%" />
          }
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
          if (params.row.last_updated === "loading") {
            return <Skeleton animation="wave" width="100%" />
          }
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
      },
      renderCell: (params) => {
        if (params.row.last_updated === "loading") {
          return <Skeleton animation="wave" width="100%" />
        }
      }
    },
  ];

  const deleteWeeklyReports = async () => {
    sessionStorage.clear()
    await APIFetch("/api/weekly-reports/", "DELETE", { ids: selected })
    getWeeklyReports()
    setOpenDeleteConfirmation(false)
  }

  const getWeeklyReports = async () => {
    if (sessionStorage.getItem("weeklyReports") !== null) {
      setWeeklyReports(JSON.parse(sessionStorage.getItem("weeklyReports")))
      return
    }
    const weeklyReportData = await APIFetch("/api/weekly-reports/", "GET")
    sessionStorage.setItem("weeklyReports", JSON.stringify(weeklyReportData))
    setWeeklyReports(weeklyReportData.reverse())
    setSelected([])
  }

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
    getWeeklyReports()
    .then(() => setLoading(false))
  }, [])
  return (
    <>
    <Navbar weeklyReports={weeklyReports} setWeeklyReports={setWeeklyReports} getWeeklyReports={getWeeklyReports} selected={selected}/>
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
        localeText={{ noRowsLabel: loading ? "" : "No Weekly Reports Exist" }}
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

    <Backdrop
      sx={{ display: "flex", flexDirection: "column", color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color="inherit" sx={{marginBottom: "17px"}}/>
      <Typography>Loading Weekly Reports...</Typography>
      <Typography>Please wait :)</Typography>
    </Backdrop>
    </>
  )
}

export default Home