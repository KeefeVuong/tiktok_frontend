import { React, useState } from 'react';
import { Box, Button, Modal, TextField } from '@mui/material';
import { APIFetch } from '../Helper';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoadingBackdrop from './LoadingBackdrop';

function BulkRefreshBtn({ selected, handleSnackbar, handleSuccessFetch }) {
    const [loading, setLoading] = useState(false)

    const bulkRefreshStats = async () => {
        if (selected.length === 0) {
            alert("Need to select a weekly report to bulk refresh stats")
            return
        }

        setLoading(true)
        let urls = []
        for (let i in selected) {
            await APIFetch(`/api/weekly-reports/${selected[i]}`, "GET")
            .then((tiktokData) => {
                for (let j in tiktokData) {
                    if (!tiktokData[j]["manual"]) {
                        urls.push(tiktokData[j]["url"])
                    }
                }
            })
            .catch((e) => {
                console.error(e.message)
                handleSnackbar(true, "ERROR: Get Tiktok Urls")
            })
        }
        
        await APIFetch("/api/tiktoks/", "PUT", {"urls": urls})
        .then(() => {
            handleSuccessFetch("SUCCESS: Bulk Refresh Stats")
        })
        .catch((e) => {
            console.error(e.message)
            handleSnackbar(true, "ERROR: Bulk Refresh Stats")
        })

        setLoading(false)
    }

    return (
        <>
            <Button onClick={bulkRefreshStats} color="inherit">
                <RefreshIcon sx={{paddingRight: "5px"}}/>
                BULK REFRESH STATS
            </Button>

            <LoadingBackdrop loading={loading} message={"Bulk Refreshing Tiktok Stats..."}/>
        </>
    )
}

export default BulkRefreshBtn