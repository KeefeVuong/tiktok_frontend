import { React, useEffect, useState } from 'react'
import { Container, TextField, Box, Button, Paper, Typography, Avatar } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import {
    useNavigate
  } from 'react-router-dom';
import { APIFetch } from "../Helper.jsx"
import logo from "../assets/logo.jpg"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useAuth from '../hooks/useAuth.jsx';

const containerStyle = {
  height: '100vh',
  display: 'flex',  
  flexDirection: "column",
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: "center",
  backgroundColor: "#e6929c",
  width: "100vw",
}

const boxStyle = {
  marginTop: "2rem",
}

const paperStyle = {
  marginTop: "-5rem",
  padding: "2rem",
  width: "20%",
  minWidth: "300px",
}

const inputStyle = {
  width: "100%",
  marginBottom: "1rem",
}

const mainButton  = {
  width: "100%",
  backgroundColor: "#e6929c",
  ":hover": {
    backgroundColor: "#e6929c",
  }
}

function Login({handleSnackbar}) {
    const navigate = useNavigate()
    const [loginForm, setLoginForm] = useState({
      username: '',
      password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const {auth, setAuth} = useAuth();

    const changeLoginDetails = (e) => {
      const {name, value} = e.target;
      setLoginForm({
        ...loginForm,
        [name]: value,
      })
    }

    const submitForm = async (e) => {
      e.preventDefault()
      await APIFetch("/api-token-auth/", "POST", loginForm)
      .then((data) => {
          localStorage.setItem("token", `Token ${data.token}`);
          setAuth(true)
          navigate("/");
        }
      ).catch(() => {
        handleSnackbar(true, "ERROR: Incorrect Login Credentials")
      })
    }

    useEffect(() => {
        if (auth) {
          navigate("/")
        }
    }, [])

 return (
    
    <Box sx={containerStyle}> 
    {/* login form*/}
      <Paper component="form" onSubmit={submitForm} elevation={2} sx={paperStyle}>
        <Box sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
          <Avatar alt="Cheekyglo Logo" src={logo} component="span" sx={{ width: 100, height: 100}}/>
          <Typography variant="h4"> 
            Tiktok Dashboard Login
          </Typography>
        </Box>
          <Box sx={boxStyle}>
            <TextField sx={inputStyle}
              required
              label="Username"
              name="username"
              onChange={changeLoginDetails}
              data-testid="loginEmail"
            />
            <TextField sx ={inputStyle}
              required
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={changeLoginDetails}
              data-testid="loginPassword"
              InputProps={{endAdornment: <Button sx={{color: "#e6929c"}} type="button" onClick={() => setShowPassword(s => !s)}>{showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}</Button>}}
            >
            </TextField>
            <Button type="submit" variant="contained" sx={mainButton} endIcon={<LoginIcon />} data-testid="loginBtn">Sign in</Button>
          </Box>

      </Paper>
    </Box>
  );
}

export default Login