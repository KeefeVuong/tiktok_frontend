import { React, useState } from 'react'
import { APIFetch } from '../Helper'
import { usePlatformContext } from '../components/PlatformContext'

function useWeeklyReports({handleSnackbar, selected, setSelected, setWeeklyReports}) {
    
    const {platform, _} = usePlatformContext()
    
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
            setWeeklyReports(JSON.parse(sessionStorage.getItem(`${platform}WeeklyReports`)))
            return
        }
        await APIFetch("/api/weekly-reports/", "GET")
        .then((weeklyReportData) => {
            weeklyReportData = weeklyReportData.filter((weeklyReport) => weeklyReport["platform"] == platform)
            sessionStorage.setItem(`${platform}WeeklyReports`, JSON.stringify(weeklyReportData.reverse()))
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