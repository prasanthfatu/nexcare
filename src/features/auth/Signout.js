import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const Signout = () => {

    const errRef = useRef(null)

    const {setAuth} = useAuth()

    const axiosPrivate = useAxiosPrivate()

    const [loading, setLoadig] = useState(false)
    const [errMsg, setErrMsg] = useState('')

    const navigate = useNavigate()

    useEffect(() => {

        const logout = async() => {
            try {
                setLoadig(true)
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
        }

        logout()
    
    }, [axiosPrivate, navigate, setAuth])

    useEffect(() => {
        if (errMsg) {
            errRef.current?.focus();
        }
    }, [errMsg]);

    const errClass = errMsg ? "errmsg" : "offscreen"

    if(loading){
        return(
            <>
                <p>Signing out...</p>
                <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>
            </>
        )
    }

    if (errMsg) {
        return (
            <section>
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
            </section>
        )
    }

    return null
}

export default Signout
