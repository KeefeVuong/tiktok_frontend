import { React, useState, useEffect } from 'react'
import { Box, Typography, Skeleton, Link, Divider, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { renderImprovements } from "../Helper.jsx"
import Navbar from "../components/Navbar"
import useWeeklyReports from '../hooks/useWeeklyReports.jsx';
import LoadingBackdrop from '../components/LoadingBackdrop.jsx';
import DeleteWeeklyReportBtn from '../components/DeleteWeeklyReportBtn.jsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [1, 2, 3],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [100, 200, 300],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };

  return (
    <>
    <Navbar
    weeklyReports={weeklyReports} 
    selected={selected} 
    getWeeklyReports={getWeeklyReports}
    handleSnackbar={handleSnackbar}
    />
    {/* <IconButton size="small" sx={{position: "absolute", left: "-1.25rem", width: "10px"}}>  */}
    <IconButton color="inherit" sx={{marginTop: "1rem", zIndex: "100", position: "absolute", right: "-0.65rem", backgroundColor: "#de8590", borderRadius: "15px", "&:hover": {backgroundColor: "#de8590"}}}>
      <DoubleArrowIcon sx={{marginRight: "0.5rem", transform: "rotate(180deg)", color: "white"}}/>
    </IconButton>
    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 65px)"}}>
        {/* <Box sx={{display: "flex", justifyContent: "space-around", height: "40%", width: "100%"}}>
          <Line
          data={data}
          options={options}
          />
          <Line
          data={data}
          options={options}
          />
        </Box>
        <Divider sx={{marginTop: "1rem"}} flexItem={true}/> */}
        <DataGrid
        sx={{border: "0", height: "60%", width: "100%"}}
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