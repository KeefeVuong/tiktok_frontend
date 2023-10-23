import React, {useState} from 'react'
import { Box, Typography, Skeleton, Link, Drawer, IconButton, Container, Slider, Autocomplete, TextField, Switch } from '@mui/material';
import { factoriseNum } from '../Helper';

function GraphScale({graphYScale, handleGraphYScale, maxVal, graphXScale, handleGraphXScale, weeklyReportTitles, adjustYAxis, setAdjustYAxis}) {
    const [from, setFrom] = useState(graphXScale[0])
    const [to, setTo] = useState(graphXScale[graphXScale.length - 1])

    const handleAdjustYAxis = () => {
        setAdjustYAxis(!adjustYAxis)
    }

    const modifyXAxis = (e, val) => {
        if (e.target.id.includes("from")) {
            setFrom(val === null ? "" : val)
            handleGraphXScale(weeklyReportTitles.slice(weeklyReportTitles.indexOf(val), weeklyReportTitles.indexOf(to) + 1))
        }
        else {
            setTo(val === null ? "" : val)
            handleGraphXScale(weeklyReportTitles.slice(weeklyReportTitles.indexOf(from), weeklyReportTitles.indexOf(val) + 1))            
        }
    }

    return (
        <>
        <Box sx={{display: "flex", justifyContent: "center", gap: "2rem"}}>
            <Autocomplete
            disablePortal
            id="from"
            value={from}
            options={weeklyReportTitles}
            sx={{ width: "30%" }}
            renderInput={(params) => <TextField {...params} label="From" />}
            disableClearable={true}
            onChange={modifyXAxis}
            />

            <Autocomplete
            disablePortal
            id="to"
            options={weeklyReportTitles}
            value={to}
            sx={{ width: "30%" }}
            renderInput={(params) => <TextField {...params} label="To" />}
            disableClearable={true}
            onChange={modifyXAxis}
            />
            <Box sx={{width: "30%"}}>
                <Typography gutterBottom>
                    Adjust Y-Axis Scale
                    <Switch 
                    checked={!adjustYAxis}
                    onChange={handleAdjustYAxis}
                    sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                            color: "#de8590"
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: "#de8590"
                        },
                    }}
                    />
                </Typography>
                <Slider
                    sx={{color: "#de8590"}}
                    disabled={!adjustYAxis}
                    value={graphYScale}
                    onChange={handleGraphYScale}
                    valueLabelFormat={factoriseNum}
                    valueLabelDisplay="auto"
                    step={25000}
                    max={maxVal}
                    min={0}
                />
            </Box>

        </Box>
        </>
    )
}

export default GraphScale