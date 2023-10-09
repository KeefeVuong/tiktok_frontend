import { React, useState } from 'react';
import { Box, Button, Modal, TextField } from '@mui/material';
import { APIFetch } from '../Helper';
import RefreshIcon from '@mui/icons-material/Refresh';

function BulkRefreshBtn({ selected, handleSuccessFetch }) {

    const bulkRefreshStats = async () => {
        if (selected.length === 0) {
            alert("Need to select a weekly report to bulk refresh stats")
            return
        }

        let urls = []
        for (let i in selected) {
            const tiktokData = await APIFetch(`/api/weekly-reports/${selected[i]}`, "GET")
            .catch((e) => {
                console.error(e.message)
                handleSnackbar(true, "ERROR: Get Tiktok Urls")
            })
            for (let j in tiktokData) {
                if (!tiktokData[j]["manual"]) {
                    urls.push(tiktokData[j]["url"])
                }
            }
        }

        await APIFetch("/api/tiktoks/", "PUT", {"urls": urls})
        .then(() => {
            handleSuccessFetch("SUCCESS: Bulk Refresh Stats")
        })
        .catch((e) => {
            console.error(e.message)
            handleSnackbar(true, "ERROR: Bulk Refresh Stats")
        })
    }

    return (
        <Button onClick={bulkRefreshStats} color="inherit">
            <RefreshIcon sx={{paddingRight: "5px"}}/>
            BULK REFRESH STATS
        </Button>
    )
}

export default BulkRefreshBtn