import { React, useEffect, useState } from 'react'
import { Container, TextField, Box, Button, Paper, Typography, Avatar, Tooltip } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import {
    useNavigate
  } from 'react-router-dom';
import { APIFetch } from "../Helper.jsx"
import logo from "../assets/logo.jpg"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useAuth from '../hooks/useAuth.jsx';
import InfoIcon from '@mui/icons-material/Info';

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
  padding: "1rem 2rem 2rem 2rem",
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

    const loginAsGuest = (e) => {
      const guestLogin = {
        username: "guest",
        password: "guest"
      }

      setLoginForm(guestLogin)
        
      submitForm(e, guestLogin);
    }

    const submitForm = async (e, loginDetails) => {
      e.preventDefault()
      await APIFetch("/api-token-auth/", "POST", loginDetails)
      .then((data) => {
          let users = JSON.parse(localStorage.getItem("users")) ?? []
          let acc = {}
          acc[loginDetails["username"]] = `Token ${data.token}`
          if (!users.some(user => JSON.stringify(user) === JSON.stringify(acc))) {
            users.push(acc)
          }

          localStorage.setItem("token", `Token ${data.token}`);
          localStorage.setItem("currentUser", loginDetails["username"])
          localStorage.setItem("users", JSON.stringify(users))
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
      <Paper component="form" onSubmit={(e) => {submitForm(e, loginForm)}} elevation={2} sx={paperStyle}>
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '3rem'}}>
          <Button onClick={loginAsGuest} sx={{color: "#e6929c", ':hover': {backgroundColor: "white"}}}>
            Guest Mode
          </Button>
          <Tooltip sx={{color: "#e6929c"}} arrow title="Click here for Guest access to the website. Most functionality has been disabled however feel free to look around!">
            <InfoIcon fontSize="small"/>
          </Tooltip>
        </Box>
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