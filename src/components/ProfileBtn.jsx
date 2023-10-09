import { React, useState, useEffect } from 'react';
import { Box, Button, Paper, Avatar, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import logo from "../assets/logo.jpg"
import LogoutBtn from './LogoutBtn';

const profilePicStyle = {
    marginRight: "7px",
    height: "25px",
    width: "25px"
}

const profileMenuStyle = {
}

function ProfileBtn() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <>
            <Button
            onClick={handleClick}
            color="inherit"
            >
            <Avatar alt="Cheekyglo Logo" src={logo} sx={profilePicStyle}/>
            Cheekyglo
            <ArrowDropDownIcon/>
            </Button>
            <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={profileMenuStyle}
            slotProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose}><Avatar/> Test</MenuItem>
                <MenuItem onClick={handleClose}><LogoutBtn/></MenuItem>

            </Menu>
        </>
    )
}

export default ProfileBtn