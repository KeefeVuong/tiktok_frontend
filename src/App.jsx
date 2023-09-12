import { useState } from 'react'
import "./App.css"
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
import WeeklyReport from './pages/WeeklyReport'
import { createTheme, ThemeProvider } from '@mui/material';

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Montserrat',
      ].join(','),
    },});

  return (
    <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/weekly-report/:id" element={<WeeklyReport/>}/>
          </Routes>
        </Router>

    </ThemeProvider>
  )
}

export default App
