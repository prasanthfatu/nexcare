import useAuth from "../../hooks/useAuth"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState, useCallback, useRef } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import EditTrack from "./EditTrack"
import TrackHead from "./TrackHead"
import useNotifyCount from "../../hooks/useNotifyCount"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppointmentSuccess = () => {

  const {profileNotify} = useNotifyCount()
 
  const errRef = useRef(null)

  const { auth } = useAuth()
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
          <p>Loading...</p>
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

  const deleteAppointment = async(appId) => {
    try {
      await axiosPrivate.delete(`/appointments/${appId}`)
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
            });
    }
  }
  } 

  const content = (
    <>
      <table className="track-table">
          <thead>
              <TrackHead />
          </thead>
          <tbody>
              <EditTrack 
                filteredStatus={filteredStatus} 
                deleteAppointment={deleteAppointment}
              />
          </tbody>
      </table>
    </>  
  )

  return (
    <div className="track-container">
      {filteredStatus.length > 0 ? content : <p className="track-para">You have not applied any appointment!</p>}
      <ToastContainer />
    </div>
  ) 

}


export default AppointmentSuccess
