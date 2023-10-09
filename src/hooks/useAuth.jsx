import { useState } from 'react'

function useAuth() {
    const [auth, setAuth] = useState(localStorage.getItem("token") !== null)
    const [currentUser, setCurrentUser] = useState(localStorage.getItem("currentUser"))

    return {auth, setAuth, currentUser, setCurrentUser}
}

export default useAuth