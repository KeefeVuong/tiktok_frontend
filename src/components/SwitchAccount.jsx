import React from 'react'
import { Avatar, MenuItem } from '@mui/material';

function SwitchAccount({user, token}) {

    const switchAccount = () => {
        localStorage.setItem("token", token);
        localStorage.setItem("currentUser", user)
        sessionStorage.clear()
        window.location.reload()
    }

    return (
        <MenuItem onClick={switchAccount}>
            <Avatar sx={{backgroundColor: "#f4be69"}}>{user.charAt(0).toUpperCase()}</Avatar>
            {user}
        </MenuItem>
    )
}

export default SwitchAccount