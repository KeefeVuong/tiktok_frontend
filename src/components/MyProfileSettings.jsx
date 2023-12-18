import { React, useEffect, useState } from 'react'
import { Box, List, ListItemButton, ListItemAvatar, ListItemText, Divider, Modal, Avatar, TextField, InputAdornment } from '@mui/material';
import { APIFetch } from '../Helper';
import { Autosave, useAutosave } from 'react-autosave';

const myProfileSettings = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "70%"
}

function MyProfileSettings() {
    const [newProfileDetails, setNewProfileDetails] = useState({
        tiktok_account: ""
    })

    const [myProfileDetails, setMyProfileDetails] = useState({
        tiktok_account: ""
    })

    const changeProfileDetails = (e) => {
        const {name, value} = e.target
        setNewProfileDetails({
            ...myProfileDetails,
            [name]: value
        })
    }

    const getProfileDetails = async () => {
        await APIFetch("/api/client/", "GET")
        .then((data) => {
            setMyProfileDetails({
                ...myProfileDetails,
                ["tiktok_account"]: data["tiktok_account"]
            })
        })
        .catch((e) => {
            console.error(e.message)
        })
    }

    const updateProfileDetails = async () => {
        if (newProfileDetails["tiktok_account"] === "") return

        await APIFetch("/api/client/", "PUT", {tiktok_account: newProfileDetails["tiktok_account"]})
        .catch((e) => {
            console.error(e.message)
        })
    }

    
    useEffect(() => {
        getProfileDetails()
    }, [])
    
    useAutosave({ data: newProfileDetails, onSave: updateProfileDetails, interval: 1000 });

    return (
        <Box sx={myProfileSettings}>
            <TextField
            label="Tiktok Account"
            name="tiktok_account"
            onChange={changeProfileDetails}
            fullWidth
            sx={{ marginBottom: "20px" }}
            InputProps={{
                startAdornment: <InputAdornment position="start">@</InputAdornment>,
            }}
            variant="standard"
            value={newProfileDetails["tiktok_account"] !== "" ? newProfileDetails["tiktok_account"] : myProfileDetails["tiktok_account"]}
            />
        </Box>
    )
}

export default MyProfileSettings