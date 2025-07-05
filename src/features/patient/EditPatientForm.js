import { useParams } from "react-router-dom"
import { useState, useEffect, useRef, useCallback } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import EditPage from "./EditPage"
import useAuth from "../../hooks/useAuth"

const EditPatientForm = () => {

  const errRef = useRef(null)
  const [errMsg, setErrMsg] = useState('')
  const {dark} = useAuth()

  const {patientId} = useParams()
  const axiosPrivate = useAxiosPrivate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(false)

    const fetchPatient = useCallback(async() => {
        try {
          setLoading(true)
          setErrMsg('')
          const response = await axiosPrivate.get(`/tests/${patientId}`)
          setPatient(response.data)
        } catch (err) {
          console.error(err);
          if (!err.status) {
            setErrMsg('Server Unreachable');
          }else {
            setErrMsg(err.data?.message || 'Error getting patient details.');
          }
        } finally {
          setLoading(false)
        }
    }, [axiosPrivate, patientId])

  useEffect(() => {
    fetchPatient()
  }, [fetchPatient])

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

        <button onClick={fetchPatient} style={{cursor: 'pointer', fontSize: '12px', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', fontWeight: 'bold'}}>Retry</button>

      </section>
        
    )
  }

  return   patient 
    ? <EditPage key={patient._id} patient={patient} patientId={patientId} /> 
    : <p style={{color: dark ? '#EAEAEA' : 'black'}}>No patient found.</p> 
      
}

export default EditPatientForm