import { React, useState } from 'react';
import { Button, Typography, Avatar, Menu, MenuItem, Divider,ListItemIcon } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import logo from "../assets/logo.jpg"
import LogoutBtn from './LogoutBtn';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import SwitchAccount from './SwitchAccount';
import SettingsForm from './SettingsForm';

const profilePicStyle = {
    marginRight: 0.75,
    height: 32,
    width: 32,
    backgroundColor: "#f4be69"
}

function ProfileBtn() {
    const {currentUser} = useAuth()
    const [users, setUsers] = useState(JSON.parse(localStorage.getItem("users")) ?? [])
    const [openSettingsModal, setOpenSettingsModal] = useState(false)
    
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

    const addAccountBtnClick = () => {
      handleClose()
      navigate("/add-account")
    }

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
              onClick={handleClose}
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