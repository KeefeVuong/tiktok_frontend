import { React, useState, useEffect } from 'react';
import { Box, Button, Typography, Toolbar, AppBar, Avatar } from '@mui/material';
import { useLocation } from "react-router-dom";
import AssessmentIcon from '@mui/icons-material/Assessment';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import logo from "../assets/logo.jpg"
import CustomModal from './CustomModal';
import BulkRefreshBtn from './BulkRefreshBtn';
import LogoutBtn from './LogoutBtn';


const NavBar = ({weeklyReports, getWeeklyReports, selected, handleSnackbar}) => {
    const location = useLocation()

    const [navbarMode, setNavbarMode] = useState("home")
    const [openAddModal, setOpenAddModal] = useState(false)

    const handleAddModal = () => {
        setOpenAddModal(!openAddModal)
    }

    const handleSuccessFetch = (message) => {
        sessionStorage.clear()
        getWeeklyReports()
        handleSnackbar(true, message)
    }

    const handlePlaceholderWeeklyReport = () => {
        const placeHolder = {
            "id": "999999",
            "last_updated": "loading"
        }

        let placeHolderReport = [... weeklyReports]
        placeHolderReport.unshift(placeHolder)
        sessionStorage.setItem("weeklyReports", JSON.stringify(placeHolderReport))
        getWeeklyReports()
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
                            <Avatar alt="Cheekyglo Logo" src={logo} component="a" href="https://www.tiktok.com/@cheekyglo" target="_blank"/>
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
                            <BulkRefreshBtn selected={selected} handleSuccessFetch={handleSuccessFetch}/>
                            |
                            <LogoutBtn/>
                        </>
                        :
                        <>
                        </>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar/>
        </Box>

        <CustomModal 
        handleAddModal={handleAddModal} 
        openAddModal={openAddModal} 
        handleSnackbar={handleSnackbar}
        handlePlaceholderWeeklyReport={handlePlaceholderWeeklyReport}
        handleSuccessFetch={handleSuccessFetch}
        />
        </>
    );
}
export default NavBar;