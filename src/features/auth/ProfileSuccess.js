import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

const ProfileSuccess = () => {

    const axiosPrivate = useAxiosPrivate()

    const errRef = useRef(null)

    const {notId} = useParams()

    const [loading, setLoading] = useState(false)
    const [errMsg, setErrMsg] = useState('')

    const [notification, setNotification] = useState('')

    useEffect(() => {
        const regNotification = async() => {
            try {
              setLoading(true)
              const response = await axiosPrivate.get(`/notifications/${notId}`)
              setNotification(response.data)
            } catch (err) {
              console.error(err)
              if (!err.response) {
                setErrMsg('Server Unreachable');
            } else {
                setErrMsg(err.data?.message || 'Error Fetching data from server.');
            }
            setLoading(false)
            } finally {
              setLoading(false)
          }    
        }
      
        regNotification ()
      
    }, [axiosPrivate, notId])

    useEffect(()=> {
        if(errMsg){
            errRef.current.focus()
        }
    }, [errMsg])

    const errClass = errMsg ? "errmsg" : "offscreen"

    if(loading){
        return(
          <>
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

    const content = (
        <section className="single-appointment">
            <div className="content-visible">
                <h5>NexCare Innovate.</h5>
                <p>{notification.recipient} your profile has uploaded!</p>
                <br/>
            </div>
        </section>
    )

    return notification && content
}

export default ProfileSuccess