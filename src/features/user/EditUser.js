import { useCallback, useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import EditUserPage from "./EditUserPage"
import useAuth from "../../hooks/useAuth"

const EditUser = () => {

    const errRef = useRef(null)
    const {dark} = useAuth()

    const {userId} = useParams()
    const axiosPrivate = useAxiosPrivate()
    const [singleUser, setSingleUser] = useState([])
    const [loading, setLoading] = useState(true)
    const [errMsg, setErrMsg] = useState('')
    
     const fetchUser = useCallback(async() => {
            try {
               setLoading(true)
               setErrMsg('')
               const response = await axiosPrivate.get(`/users/${userId}`)  
               setSingleUser(response.data)
            } catch (err) {
               console.error(err); 
                if (!err.response) {
                    setErrMsg('Server Unreachable');
                } else if (err.response.status === 400) {
                    setErrMsg(err.response.data.message);
                } else {
                    setErrMsg(err.response?.data?.message || 'Error getting user details');
                }
            } finally{
                setLoading(false)
            }
    }, [axiosPrivate, userId])

    useEffect(()=> {
        fetchUser()
    }, [fetchUser])

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

                <button onClick={fetchUser} style={{cursor: 'pointer', fontSize: '12px', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', fontWeight: 'bold'}}>Retry</button>

            </section>
        
        )
    }

    const content = singleUser && <EditUserPage key={singleUser._id} singleUser={singleUser} userId={userId} />

  return (
        <>
            {content}
        </>
  )
}

export default EditUser
