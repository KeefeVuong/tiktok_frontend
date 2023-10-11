import { React, useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, InputAdornment, Tooltip } from '@mui/material';
import { APIFetch } from '../Helper';

const addModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "250px",
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: "10px",
    borderRadius: "10px"
};

const modalButtonStyle = {
    display: "flex",
    justifyContent: "space-between"
}

function CustomModal({ handleAddModal, openAddModal, handleSnackbar, handleSuccessFetch, handlePlaceholderWeeklyReport, weeklyReports }) {
    const [modalData, setModalData] = useState({
        number_of_videos: "",
        title: "",
        tiktok_account: "Loading..."
    })

    const getTiktokAccount = async () => {
        await APIFetch("/api/client/", "GET")
        .then((data) => {
            setModalData({
                ...modalData,
                ["tiktok_account"]: data["tiktok_account"]
            })
        })
        .catch((e) => {
            console.error(e.message)
            handleSnackbar(true, "ERROR: Get Tiktok Account")
        })
    }

    const changeModalDetails = (e) => {
        const {name, value} = e.target
        setModalData({
            ...modalData,
            [name]: value
        })
    }

    const clearModalData = () => {
        setModalData({
            ...modalData,
            ["number_of_videos"]: "",
            ["title"]: ""
        })
    }

    const createWeeklyReport = async () => {
        handleAddModal()
  
        // temp work around to session storage, getweeklyreport sets if not empty.
        handlePlaceholderWeeklyReport("setup")

        await APIFetch("/api/weekly-reports/", "POST", modalData)
        .then(() => {
            handleSuccessFetch("SUCCESS: Add Weekly Report")
            clearModalData()
        })
        .catch((e) => {
            console.error(e.message)
            handleSnackbar(true, "ERROR: Add Weekly Report")
            handlePlaceholderWeeklyReport("reset")
        })
    

    }

    useEffect(() => {
        openAddModal === true ? getTiktokAccount() : null
    }, [openAddModal])

    return (
        <Modal
        open={openAddModal}
        onClose={handleAddModal}
        >
            <Box sx={addModalStyle}>
                <Tooltip title="Edit Tiktok account in settings" placement="bottom" arrow>
                    <TextField
                    sx={{ marginBottom: "20px" }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">@</InputAdornment>,
                    }}
                    fullWidth
                    disabled
                    value={modalData["tiktok_account"]}
                    />
                </Tooltip>

                <TextField
                label="Title"
                name="title"
                fullWidth
                value={modalData["title"]}
                onChange={changeModalDetails}
                sx={{marginBottom: "20px"}}
                />

                <TextField
                name="number_of_videos"
                label="Number of Videos"
                value={modalData["number_of_videos"]}
                onChange={changeModalDetails}
                fullWidth
                type="number"
                sx={{marginBottom: "30px"}}
                />

                <Box sx={modalButtonStyle}>
                    <Button onClick={clearModalData}>Clear</Button>
                    <Button variant="contained" onClick={createWeeklyReport}>Submit</Button>
                </Box>
            </Box>
        </Modal>
  )
}

export default CustomModal