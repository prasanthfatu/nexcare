import { useParams } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import EditPage from "./EditPage"

const EditPatientForm = () => {

  const errRef = useRef(null)
  const [errMsg, setErrMsg] = useState('')

  const {patientId} = useParams()
  const axiosPrivate = useAxiosPrivate()
  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPatient = async() => {
      try {
        setLoading(true)
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
    }
    fetchPatient()
  }, [axiosPrivate, patientId])

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
        <p>Loading...</p>
      </>
    )
  }

  if (errMsg || !patient) {
    return (
        <section>
            <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
        </section>
    )
}

  return   patient && <EditPage key={patient._id} patient={patient} patientId={patientId} />
      
}

export default EditPatientForm