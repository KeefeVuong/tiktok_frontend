import React from 'react'
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import useAuth from '../hooks/useAuth';

function LogoutBtn() {
    const navigate = useNavigate()
    const {setAuth} = useAuth()

    const logout = () => {
        localStorage.removeItem("token")
        sessionStorage.clear()
        navigate("/login")
    }

    return (
        <Button onClick={logout} color="inherit">
            <LogoutIcon fontSize="small" sx={{paddingRight: "5px"}}/>
            LOGOUT
        </Button>
    )
}

export default LogoutBtn