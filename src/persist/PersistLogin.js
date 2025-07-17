import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import useRefreshToken from '../hooks/useRefreshToken'
import useAuth from "../hooks/useAuth"

const PersistLogin = () => {

    const [isLoading, setIsLoading] = useState(true)
    const refresh = useRefreshToken()
    const {auth, persist, dark} = useAuth()

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
                    <div className="protected-page-loading" style={{backgroundColor: dark ? '#0D0D0D' : '#fff', color: dark ? '#EAEAEA' : 'black'}}>
                        <h2 style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '90%', height: '90%', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, borderRadius: '15px'}}>Nexcare</h2>
                    </div>
                        : <Outlet />
        }
    </>
  )
}

export default PersistLogin
