import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Signout = () => {

    const errRef = useRef(null)

    const {setAuth, dark} = useAuth()

    const axiosPrivate = useAxiosPrivate()

    const [loading, setLoadig] = useState(false)
    const [errMsg, setErrMsg] = useState('')

    const navigate = useNavigate()

    const logout = useCallback(async() => {
        try {
            setLoadig(true)
            setErrMsg('')
            await axiosPrivate.get('/logout')
            setAuth({})
            navigate('/')
        } catch (err) {
            console.error(err)
            if (!err.response) {
                setErrMsg('Server Unreachable');
            } else {
                setErrMsg(err.data?.message || 'Error signing out. Please try again.');
            }
            setLoadig(false)  
        } finally {
            setLoadig(false)
        }
    }, [axiosPrivate, navigate, setAuth])

    useEffect(() => {
        logout() 
    }, [logout])

    useEffect(() => {
        if (errMsg) {
            errRef.current?.focus();
        }
    }, [errMsg]);

    const errClass = errMsg ? "errmsg" : "offscreen"

    if(loading){
        return(
            <>
                <p style={{color: dark ? 'silver' : 'black'}}>Logging out...</p>
                <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>
            </>
        )
    }

    if (errMsg) {
    return (
        <section style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0'}}>

                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <button onClick={logout} style={{cursor: 'pointer', fontSize: '12px', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', fontWeight: 'bold'}}>Retry</button>

        </section>
    )
  }

    return null
}

export default Signout
