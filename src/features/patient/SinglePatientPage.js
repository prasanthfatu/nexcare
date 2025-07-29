import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faAddressBook, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import useAuth from "../../hooks/useAuth"

const SinglePatientPage = () => {

    const errRef = useRef(null)
    const [errMsg, setErrMsg] = useState('')
    const { dark } = useAuth()

    const { patientId } = useParams()

    const axiosPrivate = useAxiosPrivate()
    const [patient, setPatient] = useState({})
    const [loading, setLoading] = useState(false)

    const fetchSinglePatient = useCallback(async () => {
        setLoading(true)
        setErrMsg('')
         try {
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
        fetchSinglePatient()
    }, [fetchSinglePatient])

    useEffect(() => {
        if (errMsg) {
            errRef.current?.focus();
        }
    }, [errMsg]);

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

                <button onClick={fetchSinglePatient} style={{cursor: 'pointer', fontSize: '12px', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', fontWeight: 'bold'}}>Retry</button>

            </section>    
        )
  }

    const content = (
        <section className="singlepage-patient dash-outlet">

            <div className="patient-details" style={{backgroundColor: dark ? '#121212' : 'rgba(0, 0, 0, 0.9)'}}>

                <h3>Patient Details</h3>

                <div className="patient-info">
                    <p className="patient-name">Name :</p>
                    <p className="name-value">{patient.patientName}</p>
                </div>

                <div className="patient-info">
                    <p className="patient-age">Age : </p>
                    <p className="age-value">{patient.age}</p>
                </div>

                <div className="patient-info">
                    <p className="patient-age">Gender :</p>
                    <p className="age-value">{patient.gender}</p>
                </div>

                <div className="patient-info">
                    <p className="patient-age">Marital Status :</p>
                    <p className="age-value">{patient.maritalStatus}</p>
                </div>

                <p className="patient-address-show"><FontAwesomeIcon icon={faAddressBook} /> Address</p>
                <div className="patient-info address">
                    <p className="patient-address"><FontAwesomeIcon icon={faAddressBook} /></p>
                    <p className="address-value">{patient.address}</p>
                </div>

                <div className="patient-info email">
                    <p><FontAwesomeIcon icon={faEnvelope} /></p>
                    <p>{patient.email}</p>
                </div>

                <div className="patient-info email">
                    <p><FontAwesomeIcon icon={faPhone} /></p>
                    <p>{patient.phone}</p>
                </div>

            </div>

            <div className="emergency-details" style={{backgroundColor: dark ? '#121212' : 'rgba(0, 0, 0, 0.9)'}}>

                <h4>Emergency Contact</h4>

                <div className="patient-info">
                    <p className="patient-name">Fullname :</p>
                    <p className="name-value">{patient.fullname}</p>
                </div>

                <div className="patient-info">
                    <p className="patient-age">Relationship :</p>
                    <p className="age-value">{patient.relationship}</p>
                </div>

                <div className="patient-info emergency-phone">
                    <p><FontAwesomeIcon icon={faPhone} /></p>
                    <p>{patient.emerPhone}</p>
                </div>

            </div>

            <div className="patient-update">
                <div className="patient-update-icon"><Link to={`/account/patients/edit/${patient._id}`}><FontAwesomeIcon icon={faPenToSquare} style={{color: dark ? '#EAEAEA' : 'black'}} /></Link></div>
            </div>

        </section>
    )

    return (
        <>
            <nav style={{ marginBottom: '10px', marginTop: 0, fontSize: '14px', color: dark ? '#EAEAEA' : 'black' }}>
                <Link to="/account" style={{color: dark ? '#EAEAEA' : 'black' }}>Home</Link> / <Link to="/account/patients" style={{color: dark ? '#EAEAEA' : 'black' }}>Patients</Link> / {patient.patientName}
            </nav>
            { patient ? content : <p style={{color: dark ? '#EAEAEA' : 'black'}}>No patient found.</p> }
        </>
    )

}

export default SinglePatientPage
