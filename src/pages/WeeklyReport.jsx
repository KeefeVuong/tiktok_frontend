import { React, useState, useEffect } from 'react'
import Video from "../components/Video"
import Navbar from "../components/Navbar"
import { useParams } from 'react-router-dom';
import { APIFetch } from "../helper.jsx"

function WeeklyReport() {
  const [tiktoks, setTiktoks] = useState([])
  const params = useParams();

  const getTiktoks = async () => {
    const tiktokData = await APIFetch(`/api/weekly-reports/${params.id}`, "GET")
    setTiktoks(tiktokData)
  }

  useEffect(() => {
    getTiktoks()
  }, [])

  return (
    <>
      <Navbar tiktoks={tiktoks} getTiktoks={getTiktoks}/>
      <Video tiktoks={tiktoks}/>
    </>
  )
}

export default WeeklyReport