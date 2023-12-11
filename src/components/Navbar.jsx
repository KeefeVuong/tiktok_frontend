import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Toolbar, AppBar, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";
import AssessmentIcon from '@mui/icons-material/Assessment';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import MenuIcon from '@mui/icons-material/Menu';
import logo from "../assets/logo.jpg";
import CreateWeeklyReportForm from './CreateWeeklyReportForm';
import BulkRefreshBtn from './BulkRefreshBtn';
import LogoutBtn from './LogoutBtn';
import ProfileBtn from "./ProfileBtn";

const NavBar = ({ weeklyReports, getWeeklyReports, selected, handleSnackbar }) => {
    const location = useLocation();
    
    const [navbarMode, setNavbarMode] = useState("home");
    const [openAddModal, setOpenAddModal] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    const handleAddModal = () => {
        setOpenAddModal(!openAddModal);
    }

    const handleSuccessFetch = (message) => {
        sessionStorage.clear();
        getWeeklyReports();
        handleSnackbar(true, message);
    }

    const handlePlaceholderWeeklyReport = (mode) => {
        if (mode === "setup") {
            const placeHolder = {
                "id": "999999",
                "last_updated": "loading"
            }
    
            let placeHolderReport = [... weeklyReports]
            placeHolderReport.unshift(placeHolder)
            sessionStorage.setItem("weeklyReports", JSON.stringify(placeHolderReport))
        }
        else {
            sessionStorage.setItem("weeklyReports", JSON.stringify(weeklyReports))
        }
        
        getWeeklyReports()
    }

    const handleMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    useEffect(() => {
        if (location.pathname === "/") {
            setNavbarMode("home");
        } else {
            setNavbarMode("weekly-report");
        }

        // Check for mobile device based on screen width
        const handleResize = () => {
            if (window.innerWidth <= 795) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [location.pathname]);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" sx={{ backgroundColor: "#de8590" }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap:"10px" }}>
                            {navbarMode === "home" ? (
                                <>
                                    {isMobile ? (<IconButton
                                        edge="start"
                                        color="inherit"
                                        aria-label="menu"
                                        onClick={handleMenuOpen}
                                    >
                                        <MenuIcon />
                                    </IconButton>) : null}
                                    <Avatar alt="Cheekyglo Logo" src={logo} component="a" href="https://www.tiktok.com/@cheekyglo" target="_blank" />
                                    <Typography variant="h6" component="span" sx={{'&:hover': {cursor: 'pointer'}}} onClick={() => {sessionStorage.clear(); getWeeklyReports()}}>
                                        Tiktok Dashboard
                                    </Typography>
                                </>
                            ) :  
                                <>
                                    <Button color="inherit" href="#">
                                        <FastRewindIcon sx={{ paddingRight: "5px" }} />
                                        RETURN TO HOME
                                    </Button>
                                </>
                            }
                        </Box>
                       
                        {isMobile ? null : (
                            navbarMode === "home" ? (
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                                    <Button onClick={handleAddModal} color="inherit">
                                        <AssessmentIcon sx={{ paddingRight: "5px" }} />
                                        ADD WEEKLY REPORT
                                    </Button>
                                    |
                                    <BulkRefreshBtn selected={selected} handleSnackbar={handleSnackbar} handleSuccessFetch={handleSuccessFetch} />
                                    |
                                    <ProfileBtn />
                                </Box>
                            ) : null
                        )}
                    </Toolbar>
                </AppBar>
                <Toolbar />
            </Box>

            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
            >
                {navbarMode === "home" ? (
                    <Box>
                        <MenuItem onClick={handleAddModal}>
                            <Button color="inherit">
                                <AssessmentIcon sx={{ paddingRight: "5px" }} />
                                ADD WEEKLY REPORT
                            </Button>
                        </MenuItem>
                        <MenuItem>
                            <BulkRefreshBtn selected={selected} handleSnackbar={handleSnackbar} handleSuccessFetch={handleSuccessFetch}/>
                        </MenuItem>
                        <MenuItem>
                            <ProfileBtn/>
                        </MenuItem>
                    </Box>
                ) : null}
            </Menu>

        <CreateWeeklyReportForm 
        handleAddModal={handleAddModal} 
        openAddModal={openAddModal} 
        handleSnackbar={handleSnackbar}
        handlePlaceholderWeeklyReport={handlePlaceholderWeeklyReport}
        handleSuccessFetch={handleSuccessFetch}
        weeklyReports={weeklyReports}
        />
        </>
    );
}

export default NavBar;
