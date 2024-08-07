import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from "../hooks/useAuth"

const PersistLogin = () => {

    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken()
    const {auth, persist} = useAuth()

    useEffect(() => {

        let isMounted = true;

        const verifyRefreshToken = async() => {
            try {
                await refresh();
            } catch (err) {
                console.error(err);   
            } finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accessToken && persist ? verifyRefreshToken() : setIsLoading(false)
        
        return () => isMounted = false;

    }, [auth, persist, refresh])

  return (
    <>
        {!persist ?
            <Outlet />
                : isLoading ?
                    <h2 className="protected-page-loading">Nexcare</h2>
                        : <Outlet />
        }
    </>
  )
}

export default PersistLogin
