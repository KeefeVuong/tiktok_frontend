import { React, useState, useEffect } from 'react'
import { Box, Typography, Skeleton, Link, Drawer, IconButton, Container, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { APIFetch, factoriseNum, graphData, renderImprovements } from "../Helper.jsx"
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
  LogarithmicScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import TimelineIcon from '@mui/icons-material/Timeline';
import GraphScale from '../components/GraphScale.jsx';
import EdiText from 'react-editext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale
);



function Home({handleSnackbar}) {
  const [weeklyReports, setWeeklyReports] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(true)
  const [openGraphs, setOpenGraphs] = useState(false)
  const {getWeeklyReports, deleteWeeklyReports} = useWeeklyReports({handleSnackbar, selected, setSelected, setWeeklyReports})
  const [graphYScale, setGraphYScale] = useState([0, 0])
  const [graphXScale, setGraphXScale] = useState([])
  const [adjustYAxis, setAdjustYAxis] = useState(false)

  const editTitle = async (value, weekly_report_id) => {
    await APIFetch(`/api/weekly-reports/${weekly_report_id}`, "PUT", { "title": value })
    .then(() => {
      sessionStorage.clear();
      handleSnackbar(true, "SUCCESS: Update Weekly Report Title");
      getWeeklyReports();
    })
    .catch((error) => {
        console.error(error.message);
        handleSnackbar(true, "ERROR: Update Weekly Report Title");
    })
}

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
                <EdiText 
                submitOnEnter
                cancelOnEscape
                submitOnUnfocus
                showButtonsOnHover
                onSave={(value) => {
                  editTitle(value, params.row.id)
                }}
                value={params.row.title}
                renderValue={(value) => {
                  return (
                  <Link sx={{color: "#de8590", fontWeight: "bold"}} underline="none" href={frag}>
                    {value}
                  </Link>
                  )
                }}
                type="text"
                />
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
  
  const handleOpenGraphs = () => {
    setOpenGraphs(!openGraphs)
  }

  const handleGraphYScale = (event, newValue) => {
    setGraphYScale(newValue);
  };

  const handleGraphXScale = (newValue) => {
    setGraphXScale(...[newValue]);
  };

  useEffect(() => {
    getWeeklyReports()
    .then(() => {
      setLoading(false)
    })
  }, [])
  
  useEffect(() => {
    handleGraphXScale(graphData(weeklyReports, "title"))
  }, [weeklyReports])

  const totalEngagementData = {
    labels: graphXScale,
    datasets: [
      {
        label: 'Total Views',
        data: graphData(weeklyReports,"total_views", graphXScale),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Total Likes',
        data: graphData(weeklyReports, "total_likes", graphXScale),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Total Comments',
        data: graphData(weeklyReports, "total_comments", graphXScale),
        borderColor: "#6C63B1",
        backgroundColor: "#8884d8",
      },
      {
        label: 'Total Favourites',
        data: graphData(weeklyReports, "total_favourites", graphXScale),
        borderColor: "#5DAD7B",
        backgroundColor: "#82ca9d",
      },
    ],
  };

  const totalEngagementOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Engagement',
      },
    },
    scales: {
      y: { 
        min: adjustYAxis ? graphYScale[0] : null,
        max: adjustYAxis ? graphYScale[1] : null,
        title: {
          display: true,
          text: "Engagement"
        },
        ticks: {
          callback: function (value) {
            return (
              factoriseNum(value)
            )
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Weekly Reports"
        }
      }
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
    <IconButton onClick={handleOpenGraphs} color="inherit" sx={{marginTop: "2rem", zIndex: "100", position: "fixed", right: "-0.65rem", backgroundColor: "#de8590", borderRadius: "15px", "&:hover": {backgroundColor: "#de8590"}}}>
      <DoubleArrowIcon sx={{marginRight: "0.5rem", transform: "rotate(180deg)", color: "white"}}/>
    </IconButton>

    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 65px)"}}>
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

    <Drawer
      open={openGraphs}
      onClose={handleOpenGraphs}
      anchor="right"
    >
        <IconButton onClick={handleOpenGraphs} color="inherit" sx={{marginTop: "calc(2rem + 60px)", zIndex: "100", position: "absolute", left: "-0.65rem", backgroundColor: "#de8590", borderRadius: "15px", "&:hover": {backgroundColor: "#de8590"}}}>
          <DoubleArrowIcon sx={{marginLeft: "0.5rem", color: "white"}}/>
        </IconButton>
        <Box color="white" sx={{position: "absolute", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#de8590", height: "65px", width: "100%"}}>
          <TimelineIcon sx={{marginRight: "0.25rem"}}/>
          <Typography fontWeight="bold">
              Tiktok Analytics
          </Typography>
        </Box>
        <Container sx={{display: "flex", flexDirection: "column", justifyContent: "start", margin: "5.5rem 2rem 0rem 2rem", height: "100%"}} maxWidth="md">
          <GraphScale 
          graphYScale={graphYScale} 
          handleGraphYScale={handleGraphYScale} 
          maxVal={Math.max(...totalEngagementData.datasets[0].data)} 
          graphXScale={graphXScale} 
          handleGraphXScale={handleGraphXScale} 
          weeklyReportTitles={graphData(weeklyReports, "title")}
          adjustYAxis={adjustYAxis}
          setAdjustYAxis={setAdjustYAxis}
          />
          <Line
            data={totalEngagementData}
            options={totalEngagementOptions}
          />
        </Container>  
    </Drawer>

    <DeleteWeeklyReportBtn selected={selected} deleteWeeklyReports={deleteWeeklyReports}/>
    <LoadingBackdrop loading={loading} message={"Loading Weekly Report..."}/>
    </>
  )
}

export default Home