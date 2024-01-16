import { React, useState, useContext, useEffect } from 'react';
import { Button, Typography, Avatar, Menu, MenuItem, Divider,ListItemIcon, Box, Badge} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import logo from "../assets/logo.jpg"
import LogoutBtn from './LogoutBtn';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import SwitchAccount from './SwitchAccount';
import SettingsForm from './SettingsForm';
import instagram_logo from "../assets/instagram_logo.png";
import tiktok_logo from "../assets/tiktok_logo.png";
import { usePlatformContext } from './PlatformContext';

const profilePicStyle = {
    marginRight: 0.75,
    height: 32,
    width: 32,
    backgroundColor: "#f4be69"
}

const platforms = {
  "&:hover": {
    transform: "scale(1.2)",
    cursor: "pointer"
  },
  border: "3px solid",
  borderColor: "white",
  borderRadius: "10px"
}

function ProfileBtn({getWeeklyReports}) {
  const {currentUser} = useAuth()
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem("users")) ?? [])
  const [openSettingsModal, setOpenSettingsModal] = useState(false)
  const {platform, setPlatform} = usePlatformContext();
  
  const handleSettingsModal = () => {
      setOpenSettingsModal(!openSettingsModal)
    }

    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handlePlatform = (newPlatform) => {
        setPlatform(newPlatform)
    }

    const addAccountBtnClick = () => {
      handleClose()
      navigate("/add-account")
    }

    useEffect(() => {
        sessionStorage.clear();
        getWeeklyReports();
    }, [platform])

    return (
        <>
            <Button
            onClick={handleClick}
            color="inherit"
            >
            {/* <Avatar alt="Cheekyglo Logo" src={logo} sx={profilePicStyle}/> */}
            <Avatar sx={profilePicStyle}>
              {currentUser === null ? "" : currentUser.charAt(0)}
            </Avatar>
              {currentUser}
            <ArrowDropDownIcon/>
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              // onClick={handleClose}
              PaperProps={{
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
        {/* <Typography sx={{textAlign: "center", marginBottom: "10px", marginTop: "5px"}}>Switch to Instagram</Typography>
        <Divider sx={{marginBottom: "10px"}}/> */}
        <Box sx={{display: "flex", justifyContent: "center", marginBottom: "7px", gap: "5px"}}>
            <Avatar alt="tiktok logo" sx={platforms} style={{borderColor: platform === "tiktok" ? "#de8590" : "",}} src={tiktok_logo} onClick={() => {handlePlatform("tiktok")}}/>
            <Avatar alt="instagram logo" sx={platforms} style={{borderColor: platform === "instagram" ? "#de8590" : "",}} src={instagram_logo} onClick={() => {handlePlatform("instagram")}}/>
        </Box>
        <Divider sx={{marginBottom: "10px"}}/>
        {users.map((user, i) => {
          let name = Object.keys(user)[0]
          let token = user[name]
          return name !== currentUser ? (
            <SwitchAccount key={i} user={name} token={token}/>
          ) : null
        })}

        {users.length <= 1 && 
          <Typography sx={{textAlign: "center", marginBottom: "10px", marginTop: "5px"}}>
            No other accounts
          </Typography>
        }

        <Divider sx={{marginBottom: "10px"}}/>
        {/* <MenuItem>
          <ListItemIcon>
            <img src={instagram_logo} height="23px" width="23px"></img>
          </ListItemIcon>
          Switch to Instagram
        </MenuItem> */}
        <MenuItem onClick={addAccountBtnClick}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleSettingsModal}>
          <ListItemIcon>
            <Settings fontSize="small"/>
          </ListItemIcon>
          Settings
        </MenuItem>

        <LogoutBtn/>
      </Menu>
      <SettingsForm openSettingsModal={openSettingsModal} handleSettingsModal={handleSettingsModal}/>
      </>
    )
}

export default ProfileBtn