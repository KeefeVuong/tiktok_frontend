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
import ProtectedRoute from './components/ProtectedRoute';
import useSnackbar from "./hooks/useSnackbar";
import SuccessSnackbar from "./components/Snackbar";
import AddAccount from "./pages/AddAccount";
import { PlatformContextProvider } from "./components/PlatformContext";

function App() {
  const {snackbar, handleSnackbar} = useSnackbar()

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Montserrat',
      ].join(','),
    },});

  return (
    <PlatformContextProvider>
    <ThemeProvider theme={theme}>
        <Router>
          <Routes>
              <Route path="/" element={<ProtectedRoute><Home handleSnackbar={handleSnackbar}/></ProtectedRoute>}/>
              <Route path="/login" element={<Login handleSnackbar={handleSnackbar}/>}/>
              <Route path="/weekly-report/:id" element={<ProtectedRoute><WeeklyReport handleSnackbar={handleSnackbar}/></ProtectedRoute>}/>
              <Route path="/add-account" element={<ProtectedRoute><AddAccount handleSnackbar={handleSnackbar}/></ProtectedRoute>}/>
          </Routes>
        </Router>
        <SuccessSnackbar open={snackbar["open"]} handleSnackbar={handleSnackbar} message={snackbar["message"]}/>
    </ThemeProvider>
    </PlatformContextProvider>
  )
}

export default App
