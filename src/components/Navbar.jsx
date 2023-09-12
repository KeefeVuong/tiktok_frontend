import { React, useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, Toolbar, AppBar, TextField, Avatar } from '@mui/material';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'dayjs/locale/en-gb';
import { APIFetch } from '../Helper';
import RefreshIcon from '@mui/icons-material/Refresh';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SuccessSnackbar from './Snackbar';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import logo from "../assets/logo.jpg"
import LogoutIcon from '@mui/icons-material/Logout';

const addModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "30%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "10px",
};

const dateStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px"
}

const modalButtonStyle = {
    display: "flex",
    justifyContent: "space-between"
}

const NavBar = ({ weeklyReports, setWeeklyReports, getWeeklyReports, tiktoks, getTiktoks, selected }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [navbarMode, setNavbarMode] = useState("home")
    const [openAddModal, setOpenAddModal] = useState(false)
    const handleAddModal = () => {
        setOpenAddModal(!openAddModal)
        clearDates()
    }

    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [title, setTitle] = useState("")

    const clearDates = () => {
        setStartDate(null)
        setEndDate(null)
        setTitle("")
    }

    const submitDates = async () => {
        // if (startDate == null || endDate == null) {
        //     alert("Please ensure you have chosen a start and end date")
        // }
        // else if (startDate >= endDate) {
        //     alert("Please ensure your start date comes before the end date")
        // }
        // else {
        //     console.log("created weekly report")
        //     handleAddModal()
        // }
        handleAddModal()
        const data = {
            "title": title,
            "start_date": new Date(startDate).toLocaleDateString("fr-CA", {year:"numeric", month: "2-digit", day:"2-digit"}),
            "end_date": new Date(endDate).toLocaleDateString("fr-CA", {year:"numeric", month: "2-digit", day:"2-digit"})
        }
        // if (weeklyReports.length !== 0) {
        //     let lastReport = weeklyReports[weeklyReports.length - 1]
        //     let endDate = Date.parse(lastReport["end_date"])
        //     let now = new Date(new Date().toDateString()).getTime()
        //     if (now <= endDate) {
        //         alert("It hasn't been a week since the last weekly report")
        //         return
        //     }
        // }   
        const placeHolder = {
            "id": "999999",
            "last_updated": "loading"
        }
        sessionStorage.clear()
        let placeHolderReport = [ ... weeklyReports ]
        placeHolderReport.unshift(placeHolder)
        setWeeklyReports(placeHolderReport)
        getWeeklyReports()
        await APIFetch("/api/weekly-reports/", "POST", data)
        placeHolderReport.pop()
        setWeeklyReports(placeHolderReport)
        getWeeklyReports()
        setSnackbarMessage("SUCCESS: Add Weekly Report")
        setOpenSnackbar(true)
    }

    const bulkRefreshStats = async () => {
        if (selected.length === 0) {
            alert("Need to select a weekly report to bulk refresh stats")
            return
        }

        let urls = []
        for (let i in selected) {
            const tiktokData = await APIFetch(`/api/weekly-reports/${selected[i]}`, "GET")
            for (let j in tiktokData) {
                urls.push(tiktokData[j]["url"])
            }
        }
        sessionStorage.clear()
        await APIFetch("/api/tiktoks/", "PUT", {"urls": urls})
        getWeeklyReports()
        setSnackbarMessage("SUCCESS: Bulk Refresh Stats")
        setOpenSnackbar(true)
    }

    const refreshStats = async () => {
        let urls = []
        for (let i in tiktoks) {
            urls.push(tiktoks[i]["url"])
        }
        sessionStorage.clear()
        await APIFetch("/api/tiktoks/", "PUT", {"urls": urls})
        getTiktoks()
        setSnackbarMessage("SUCCESS: Refresh Stats")
        setOpenSnackbar(true)
    }

    const logout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    useEffect(() => {
        if (location.pathname === "/") {
            setNavbarMode("home")
        }
        else {
            setNavbarMode("weekly-report")
        }
    }, [location.pathname])

    return (
        <>
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" sx={{backgroundColor: "#de8590"}}>
            <Toolbar sx={{display: "flex", justifyContent: "space-between"}}>
                <Box>
                    {navbarMode === "home" ?
                    <Box sx={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <Avatar alt="Cheekyglo Logo" src={logo} component="span"/>
                        <Typography variant="h6" component="span">
                            Tiktok Stats
                        </Typography>

                    </Box>
    
                    :
                    <Button href="#" color="inherit">
                        <FastRewindIcon sx={{paddingRight: "5px"}}/>
                        RETURN TO HOME
                    </Button>
                    }
                </Box>
                <Box>
                    {navbarMode === "home" ?
                    <>
                        <Button onClick={handleAddModal} color="inherit">
                            <AssessmentIcon sx={{paddingRight: "5px"}}/>
                            ADD WEEKLY REPORT
                        </Button>
                        |
                        <Button onClick={bulkRefreshStats} color="inherit">
                            <RefreshIcon sx={{paddingRight: "5px"}}/>
                            BULK REFRESH STATS
                        </Button>
                        |
                        <Button onClick={logout} color="inherit">
                            <LogoutIcon fontSize="small" sx={{paddingRight: "5px"}}/>
                            LOGOUT
                        </Button>
                    </>
                    :
                    <Button onClick={refreshStats} color="inherit">
                        <RefreshIcon sx={{paddingRight: "5px"}}/>
                        REFRESH STATS
                    </Button>
                    }
                </Box>
            </Toolbar>
        </AppBar>
        <Toolbar/>
        </Box>


        <SuccessSnackbar open={openSnackbar} setOpen={setOpenSnackbar} message={snackbarMessage}/>
        <Modal
        open={openAddModal}
        onClose={handleAddModal}
        >
            <Box sx={addModalStyle}>
                <TextField
                label="Title"
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{marginBottom: "30px"}}
                />
                <Box sx={dateStyle}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                        <DatePicker
                        value={startDate}
                        onChange={(value) => setStartDate(value)}
                        slotProps={{
                            textField: {
                              helperText: 'Start Date',
                            },
                        }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                        <DatePicker
                        value={endDate}
                        onChange={(value) => setEndDate(value)}
                        slotProps={{
                            textField: {
                              helperText: 'End Date',
                            },
                        }}
                        />
                    </LocalizationProvider>
                </Box>
                <Box sx={modalButtonStyle}>
                    <Button onClick={clearDates}>Clear</Button>
                    <Button variant="contained" onClick={submitDates}>Submit</Button>
                </Box>
    
            </Box>
        </Modal>
        </>
    );
}
export default NavBar;