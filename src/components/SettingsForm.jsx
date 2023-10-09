import { React, useState } from 'react'
import { Box, List, ListItemButton, ListItemAvatar, ListItemText, Divider, Modal, Avatar, TextField, InputAdornment } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import MyProfileSettings from './MyProfileSettings';

const settingsModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    height: "50%",
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "15px",
    borderRadius: "10px",
    display: "flex"
};

const settingsListStyle = {
    width: "30%",
}

function SettingsForm( {openSettingsModal, handleSettingsModal }) {
    const [selectedSetting, setSelectedSetting] = useState(0)
    const handleSelectedSetting = (e, index) => {
        setSelectedSetting(index)
    }

    return (
        <Modal
        open={openSettingsModal}
        onClose={handleSettingsModal}
        >
            <Box sx={settingsModalStyle}>
                <List component="nav" sx={settingsListStyle} >
                    <ListItemButton onClick={(e) => {handleSelectedSetting(e, 0)}} selected={selectedSetting === 0}>
                        <ListItemAvatar>
                            <Avatar>
                                <ManageAccountsIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="My Profile" />
                    </ListItemButton>
                    <Divider sx={{margin: "10px"}}/>
                    {/* <ListItemButton onClick={(e) => {handleSelectedSetting(e, 1)}} selected={selectedSetting === 1}>
                        <ListItemAvatar>
                            <Avatar>
                                <ManageAccountsIcon/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="My Profile" />
                    </ListItemButton> */}
                </List>
                <Divider flexItem orientation="vertical" sx={{margin: "15px"}}/>
                <MyProfileSettings/>
            </Box>
        </Modal>
    )
}

export default SettingsForm