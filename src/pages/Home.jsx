import { React, useState, useEffect } from 'react'
import { Box, Typography, Skeleton, Link} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { renderImprovements } from "../Helper.jsx"
import Navbar from "../components/Navbar"
import useWeeklyReports from '../hooks/useWeeklyReports.jsx';
import LoadingBackdrop from '../components/LoadingBackdrop.jsx';
import DeleteWeeklyReportBtn from '../components/DeleteWeeklyReportBtn.jsx';

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
    { field: 'total_favourites', width:185, 
      renderHeader: () => {
        return (
          <Typography fontWeight="bold">Total Favourites</Typography>
        )
      },
      renderCell: (params) => {
        if (params.row.last_updated === "loading") {
          return <Skeleton animation="wave" width="100%" />
        }
        return renderImprovements(params.row.total_favourites, params.row.total_improvement_favourites, params.row.last_updated)
      }
  },
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

function Home({handleSnackbar}) {
  const [weeklyReports, setWeeklyReports] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const {getWeeklyReports, deleteWeeklyReports} = useWeeklyReports({handleSnackbar, selected, setSelected, setWeeklyReports})

  useEffect(() => {
    getWeeklyReports()
    .then(() => setLoading(false))
  }, [])

  return (
    <>
    <Navbar
    weeklyReports={weeklyReports} 
    selected={selected} 
    getWeeklyReports={getWeeklyReports}
    handleSnackbar={handleSnackbar}
    />
    <Box sx={{height: "calc(100vh - 65px)"}}>
        <DataGrid
        sx={{border: 0}}
        rows={weeklyReports}
        columns={columns}
        checkboxSelection 
        disableRowSelectionOnClick
        rowSelectionModel={selected}
        onRowSelectionModelChange={(newSelected) => {
          setSelected(newSelected)
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

    <DeleteWeeklyReportBtn selected={selected} deleteWeeklyReports={deleteWeeklyReports}/>
    <LoadingBackdrop loading={loading} message={"Loading Weekly Report"}/>
    </>
  )
}

export default Home