import { Box, Typography } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export const APIFetch = async (path, method, body) => {
  const baseUrl = window.location.origin.includes("localhost")
    ? 'http://127.0.0.1:8000'
    : 'https://keefe-tk-be.xyz';

  const callContent = {
    method: method,
    headers: {
      'Authorization': `${localStorage.getItem("token")}`,
      'Content-Type' : "application/json",
    },
    body: method === 'GET' ? undefined : JSON.stringify(body)
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, callContent);
    const data = await response.json();

    if (response.ok) {
      return Promise.resolve(data);
    }

    throw new Error(data);
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
      factoriseNum(stat)
    )
  }
}

export const factoriseNum = (stat) => {
  return Intl.NumberFormat('en-US', {notation: "compact",maximumFractionDigits: 0}).format(stat)
}

export const graphData = (weeklyReports, stat, graphXScale=undefined) => {
  return !graphXScale ? weeklyReports.map(weeklyReport => weeklyReport[stat]).reverse() : weeklyReports.filter(weeklyReport => graphXScale.includes(weeklyReport["title"])).map(weeklyReport => weeklyReport[stat]).reverse()
}
