import { useCallback, useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare} from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"

const SingleUserPage = () => {

    const {dark} = useAuth()
    const {userId} = useParams()

    const errRef = useRef(null)

    const axiosPrivate = useAxiosPrivate()

    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [errMsg, setErrMsg] = useState('')

    const getUser = useCallback(async() => {
            try {
                setLoading(true)
                setErrMsg('')
                const response = await axiosPrivate.get(`/users/${userId}`)
                setUser(response.data)
            } catch (err) {
                console.error(err.message);
                if (!err.response) {
                    setErrMsg('Server Unreachable');
                } else if (err.response.status === 400) {
                    setErrMsg(err.response.data.message);
                } else {
                    setErrMsg(err.response?.data?.message || 'Error getting user details');
                }
            } finally {
                setLoading(false)
            }
        }, [axiosPrivate, userId])

    useEffect(() => {    
        getUser()
    }, [getUser])

    const errClass = errMsg ? "errmsg" : "offscreen"

    if(loading) {
        return(
            <>
                <p style={{color: dark ? '#EAEAEA' : 'black'}}>Loading...</p>
                <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>
            </>
        )
    }

     if (errMsg) {
        return (
            <section style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0'}}>

                <p ref={errRef} className={errClass} aria-live="assertive" style={{cursor: 'default'}}>{errMsg}</p>

                <p style={{color: dark ? 'gray' : 'black', margin: '0.25rem 0 1rem', cursor: 'default'}}>Could not retrieve information</p>

                <button onClick={getUser} style={{cursor: 'pointer', fontSize: '12px', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', fontWeight: 'bold'}}>Retry</button>

            </section>
        
        )
    }

    const content = (
        <section>
            <h3 style={{color: dark ? '#EAEAEA' : 'black'}}>User Details</h3>
            <p style={{color: dark ? '#BBBBBB' : 'black', cursor:'default'}}>Name: {user.username}</p>
            <p style={{color: dark ? '#BBBBBB' : 'black', cursor: 'default'}}>Role: {user.roles}</p>
            <Link to={`/account/users/edit/${user._id}`}><FontAwesomeIcon icon={faPenToSquare} style={{color: dark ? '#EAEAEA' : 'black'}} /></Link>
        </section>
    )

    return content
}

export default SingleUserPage
