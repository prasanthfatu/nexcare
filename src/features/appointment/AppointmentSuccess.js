import useAuth from "../../hooks/useAuth"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState, useCallback } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import EditTrack from "./EditTrack"
import TrackHead from "./TrackHead"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppointmentSuccess = () => {

  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()

  const [status, setStatus] = useState([])
  const [loading, setLoading] = useState(false)

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
    } finally {
      setLoading(false)
    }
  }, [axiosPrivate, setStatus])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  const filteredStatus = status.length > 0 &&
    status.filter(patient => {
      const { patientName } = patient
      return username === patientName
    })

  if (loading) {
    return <p>Loading...</p>
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
    } catch (err) {
      console.error(err);
        if (!err.response) {
            toast.error('Server Unreachable.', {
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
      {filteredStatus.length > 0 ? content : <p>You have not applied any appointment!</p>}
      <ToastContainer />
    </div>
  ) 

}


export default AppointmentSuccess
