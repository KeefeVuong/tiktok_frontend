import { React, useState } from 'react'
import { APIFetch } from '../Helper'

function useWeeklyReports({handleSnackbar, selected, setSelected, setWeeklyReports}) {

    const deleteWeeklyReports = async () => {
        sessionStorage.clear()
        await APIFetch("/api/weekly-reports/", "DELETE", { ids: selected })
        .then(() => getWeeklyReports())
        .catch((e) => {
            console.error(e.message)
            handleSnackbar(true, "ERROR: Delete Weekly Report")
        })
        // setOpenDeleteConfirmation(false)
    }
    
    const getWeeklyReports = async () => {
        if (sessionStorage.getItem("weeklyReports") !== null) {
            setWeeklyReports(JSON.parse(sessionStorage.getItem("weeklyReports")))
            return
        }
        await APIFetch("/api/weekly-reports/", "GET")
        .then((weeklyReportData) => {
            sessionStorage.setItem("weeklyReports", JSON.stringify(weeklyReportData.reverse()))
            setWeeklyReports(weeklyReportData)
            setSelected([])
        })
        .catch((e) => {
            console.error(e.message)
            handleSnackbar(true, "ERROR: Get Weekly Report")
        })
    }

    return {getWeeklyReports, deleteWeeklyReports}
}

export default useWeeklyReports