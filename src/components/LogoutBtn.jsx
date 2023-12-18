import React from 'react'
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { MenuItem, ListItemIcon } from '@mui/material';

function LogoutBtn() {
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("currentUser")
        sessionStorage.clear()
        navigate("/login")
    }

    return (
        <MenuItem onClick={logout}>
            <ListItemIcon>
                <Logout fontSize="small"/>
            </ListItemIcon>
            Logout
        </MenuItem>
    )
}

export default LogoutBtn