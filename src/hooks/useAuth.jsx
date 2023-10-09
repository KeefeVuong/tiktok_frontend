import { useState } from 'react'

function useAuth() {
    const [auth, setAuth] = useState(localStorage.getItem("token") !== null)

    return {auth, setAuth}
}

export default useAuth