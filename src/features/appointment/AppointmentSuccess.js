import useAuth from "../../hooks/useAuth"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState, useCallback, useRef } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import EditTrack from "./EditTrack"
import TrackHead from "./TrackHead"
import useNotifyCount from "../../hooks/useNotifyCount"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppointmentSuccess = () => {

  const {profileNotify} = useNotifyCount()
  const [delPopup, setDelPopup] = useState(false)
  const [appointmentId, setAppointmentId] = useState(null)
  const [delLoading, setDelLoading] = useState(false)
 
  const errRef = useRef(null)

  const {auth, dark} = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [status, setStatus] = useState([])
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const decode = auth?.accessToken ?
    jwtDecode(auth.accessToken)
    : undefined

  const username = decode.UserInfo.username

  const fetchStatus = useCallback(async () => {
    setLoading(true)
    setErrMsg('')
    try {
      const response = await axiosPrivate.get('/appointments')
      setStatus(response.data)
    } catch (err) {
      console.error(err);
      if (!err.response) {
        setErrMsg('Server Unreachable');
      } else if(err.response.status === 400){
        setErrMsg(err.response.data.message);
      } else {
        setErrMsg(err.data?.message || 'Error getting appointment details.');
      }
    } finally {
      setLoading(false)
    }
  }, [axiosPrivate, setStatus])

    const deleteAppointment = useCallback(async(appointmentId) => {
      try {
        setDelPopup(false)
        setDelLoading(true)
        await axiosPrivate.delete(`/appointments/${appointmentId}`)
        toast.success('Appointment deleted successfully!', {
          position: "top-center",
          autoClose: 1000,
          style: {
            width: 'auto',
            height: 'auto',
            fontSize: "0.8rem"
          },
          onClose:() => {
            fetchStatus()
          }
        })
        profileNotify()
      } catch (err) {
        console.error(err);
          if (!err.response) {
              toast.error('Server Unreachable.', {
                position: "top-center",
                style: {
                  width: 'auto',
                  height: 'auto',
                  fontSize: "0.8rem",
                  margin: "0 auto",
                  whiteSpace: "nowrap"
                }
              });
          } else {
              toast.error('Error Deleting Appointment', {
                position: "top-center",
                style: {
                  width: 'auto',
                  height: 'auto',
                  fontSize: "0.8rem",
                  margin: "0 auto",
                  whiteSpace: "nowrap"
                }
          });} 
        } finally {
          setDelLoading(false)
        }
  }, [axiosPrivate, fetchStatus, profileNotify])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  useEffect(() => {
    if (errMsg) {
        errRef.current?.focus();
    }
  }, [errMsg]);

  const filteredStatus = status.length > 0 &&
    status.filter(patient => {
      const { patientName } = patient
      return username === patientName
    })

  const errClass = errMsg ? "errmsg" : "offscreen"

  if (loading) {
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

                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

                <p style={{color: dark ? 'gray' : 'black', margin: '0.25rem 0 1rem', cursor: 'default'}}>Could not retrieve information</p>

                <button onClick={fetchStatus} style={{cursor: 'pointer', fontSize: '12px', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', fontWeight: 'bold'}}>Retry</button>

        </section>
    )
  }

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0, right: 0, bottom: 0, left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
  modal: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '400px',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    border: 'none',
    background: 'transparent',
    fontSize: '18px',
    cursor: 'pointer',
  },
  }

  const content = (
    <>
      <table className="track-table">
          <thead>
              <TrackHead dark={dark} />
          </thead>
          <tbody>
              <EditTrack 
                filteredStatus={filteredStatus} 
                setDelPopup={setDelPopup}
                dark={dark}
                setAppointmentId={setAppointmentId}
              />
          </tbody>
      </table>
    </>  
  )

  return (
    <div className="track-container" style={{position: 'relative'}}>
      <h4 style={{color: dark ? 'silver' : '#333333', textAlign: 'center'}}>Track Appointment Status</h4>
      {filteredStatus.length > 0 ? content : <p style={{cursor: 'default'}} className="track-para">You have not applied any appointment!</p>}
       <div>
              {
                delPopup && (
                  <div style={styles.overlay}>  
                    <div style={styles.modal}>
      
                            <div onClick={() => setDelPopup(false)} style={styles.closeBtn}>
                              <FontAwesomeIcon icon={faXmark} />
                            </div>
      
                            <p style={{ color: '#333333', fontSize: '15px', cursor: 'default', padding: '10px', textAlign: 'center'}}>Proceed with deletion?</p> 
      
                            <div className="confirm-delete-btn">
      
                              <button type='button' onClick={() => setDelPopup(false)} style={{backgroundColor: '#007bff', color: 'white', fontSize: '12px', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>cancel</button>
      
                              <button type='button' onClick={() => deleteAppointment(appointmentId)} style={{backgroundColor: 'firebrick', color: 'white', fontSize: '12px', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>delete</button>
      
                            </div>
                    </div>
      
                  </div>  
                    )
                }
       </div>
       <div>
        {
          delLoading && (
            <div style={{position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, gap: '10px'}}>
              <span className="del-spin" style={{width: '25px', height: '25px', backgroundColor: 'transparent', border: '2.5px solid #ccc', borderTop: '2.5px solid transparent', borderRadius: '50%'}}></span>
              <span style={{color: dark ? '#333333' : 'silver' }}>Deleting now...</span>
            </div>
          )
        }
       </div>
      <ToastContainer />
    </div>
  ) 

}


export default AppointmentSuccess
