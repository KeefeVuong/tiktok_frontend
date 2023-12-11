import React from 'react'
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { MenuItem, ListItemIcon } from '@mui/material';

function LogoutBtn() {
    const navigate = useNavigate()

    const logout = () => {
        let toRemove = localStorage.getItem("currentUser")
        localStorage.removeItem("token")
        localStorage.removeItem("currentUser")
        localStorage.setItem("users", JSON.stringify(JSON.parse(localStorage.getItem("users")).filter(user => Object.keys(user)[0] !== toRemove)));
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