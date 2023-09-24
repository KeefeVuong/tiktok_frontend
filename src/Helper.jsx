import { Box, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export const APIFetch = async (path, method, body) => {
  const callContent = {
    mode: "cors",
    method: method,
    headers: {
      'Authorization': `${localStorage.getItem("token")}`,
      // 'Authorization': 'Token 838fde2cfe52cf25e4aa5f6ac90f3ff8418f0c58',
      'Content-Type' : 'application/json',
    },
    body: method === 'GET' ? undefined : JSON.stringify(body)
  }

  try {
    // const response = await fetch(`https://keefe-tk-be.xyz${path}`, callContent);
    const response = await fetch(`http://127.0.0.1:8000${path}`, callContent);
    const data = await response.json();
    if (response.ok) {
      return Promise.resolve(data);
    }
    return Promise.reject(data);
  } catch (e) {
    return Promise.reject(e);
  }
}


export const getImprovementColour = (improvement_val) => {
  if (improvement_val < 0) {
    return "red"
  }
  else if (improvement_val === 0) {
    return "grey"
  }
  else {
    return "green"
  }
}

export const renderImprovements = (stat, improvement_stat, last_updated, individual = false, type) => {
  if (last_updated !== "") {
    let status = getImprovementColour(improvement_stat)
    return (
      <Box sx={{display: "flex", alignItems:"center"}}>
        <Box>
          <Box fontWeight={individual ? "bold" : ""} component="span">{Intl.NumberFormat('en-US', {notation: "compact",maximumFractionDigits: 0}).format(stat)} </Box> 
          {individual && `${type}`}
        </Box>
        <Box sx={{display: "flex", color: status}}>
          { status === "green" && <ArrowDropUpIcon fontSize={individual ? "medium" : "small"}/> }
          { status === "red" && <ArrowDropDownIcon fontSize={individual ? "medium" : "small"}/> }
          { status !== "grey" && Intl.NumberFormat('en-US', {notation: "compact", maximumFractionDigits: 0}).format(Math.abs(improvement_stat)) }
        </Box>
      </Box>
    )
  }
  else {
    return (
      Intl.NumberFormat('en-US', {notation: "compact",maximumFractionDigits: 0}).format(stat)
    )
  }
}