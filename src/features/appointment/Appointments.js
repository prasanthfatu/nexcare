import { useState, useEffect, useCallback, useRef } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import moment from 'moment'

const Appointments = () => {

  const axiosPrivate = useAxiosPrivate()

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)

  const errRef = useRef(null)
  const [errMsg, setErrMsg] = useState('')

  const {auth} = useAuth()
  const decode = auth?.accessToken ? 
                                  jwtDecode(auth.accessToken)
                                      : undefined
  const doctorName = decode.UserInfo.username                                    

  const filteredAppointments = appointments.filter(appointment => {
      return doctorName === appointment.doctor
  })

  const fetchAppointments = useCallback(async() => {
    setLoading(true)
    try {
      const response = await axiosPrivate.get('/appointments')
      setAppointments(response.data)
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
  }, [axiosPrivate, setAppointments])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  useEffect(() => {
    if (errMsg) {
        errRef.current?.focus();
    }
  }, [errMsg]);
 
const handleAccept = async (id) => {
  try {
      await axiosPrivate.put(`/appointments`, 
      JSON.stringify({ status: "accept", id }));
      fetchAppointments()
  } catch (err) {
      console.error(err);
  }

};

const handleDeny = async (id) => {
  try {
      await axiosPrivate.put(`/appointments`, 
      JSON.stringify({ status: "deny", id }));
      fetchAppointments()
  } catch (err) {
      console.error(err);
  }

};

const errClass = errMsg ? "errmsg" : "offscreen"

if(loading){
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

if(filteredAppointments.length === 0) {
  return <h2 className='appointment-head'>Appointments Empty</h2>
}

return (
  <>
  { filteredAppointments.length > 0 &&
  <div>
      <h2 className='appointment-head'>Appointments</h2>
      <ul className='all-appointments'>
          { 
              filteredAppointments.map(appointment => {
                  const date = moment(appointment.startTime).format('YYYY-MM-DD');
                  const timeFrom = moment(appointment.startTime).format('HH:mm');
                  const timeTo = moment(appointment.endTime).format('HH:mm');

                  return (
                      <li key={appointment._id}>
                          <div>Patient Name: {appointment.patientName}</div>
                          <div>Date: {date}</div>
                          <div>Time: {timeFrom} - {timeTo}</div>
                          <div>Status: {appointment.status}</div>
                          {appointment.status === 'pending' && (
                              <div className='appointment-status'>
                                  <button onClick={() => handleAccept(appointment._id)}>Accept</button>
                                  <button onClick={() => handleDeny(appointment._id)}>Deny</button>
                              </div>
                          )}
                      </li>
                  );
              })
          }
      </ul>
  </div>}
  </>
);

}

export default Appointments
