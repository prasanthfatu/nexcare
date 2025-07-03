import {useState, useEffect, useRef, useCallback} from 'react'
import { useParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'

const RegSuccessMessage = () => {

  const { dark } = useAuth()

  const errRef = useRef(null)

  const axiosPrivate = useAxiosPrivate()

  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const [notification, setNotification] = useState('')

  const {notId} = useParams()

  const regNotification = useCallback(async() => {
    setLoading(true)
    setErrMsg('')
      try {
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
  }, [axiosPrivate, notId])
  
  useEffect(() => {
    regNotification()
  }, [regNotification])

  useEffect(() => {
    if (errMsg) {
        errRef.current?.focus();
    }
}, [errMsg]);

  const errClass = errMsg ? "errmsg" : "offscreen"

  if(loading){
      return(
          <>
              <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>
              <p style={{color: dark ? '#EAEAEA' : 'black'}}>Loading...</p> 
          </>
      )
  }

  if (errMsg) {
        return (
            <section style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0'}}>
                <p ref={errRef} className={errClass} aria-live="assertive" style={{cursor: 'default'}}>{errMsg}</p>
                <p style={{color: dark ? 'gray' : 'black', margin: '0.25rem 0 1rem', cursor: 'default'}}>Could not retrieve information</p>
                <button onClick={regNotification} style={{cursor: 'pointer', fontSize: '12px', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', fontWeight: 'bold'}}>Retry</button>
            </section>
        )
    }
  
  const content = (
      <section className="single-appointment" style={{border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}>
          <div className="content-visible">
              <h5>Welcome to NexCare Innovate.</h5>
              <p style={{color: dark ? 'silver' : 'black'}}>{notification.recipient} your account is now active and ready to access our comprehensive medical testing services.</p>
              <br/>
          </div>
      </section>
  ) 
  
  return notification && content

}

export default RegSuccessMessage
