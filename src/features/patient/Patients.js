import { useEffect, useState, useCallback, useRef } from "react"
import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import PatientsList from "./PatientsList"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Patients = () => {

    const errRef = useRef(null)
    const [errMsg, setErrMsg] = useState('')

    const { patients, setPatients} = useAuth()
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const axiosPrivate = useAxiosPrivate()

    const getPatients = useCallback(async () => {
        try {
            setLoading(true)
            const response = await axiosPrivate.get('/tests');
            setPatients(response.data);
        } catch (err) {
            console.error(err); 
            if (!err.response) {
                setErrMsg('Server Unreachable');
            } else if(err.response.status === 400){
                setErrMsg(err.response.data.message);
            } else {
                setErrMsg(err.data?.message || 'Error getting patient details.');
            }
        } finally {
            setLoading(false)
        }

    }, [axiosPrivate, setPatients])

    useEffect(() => {       
        getPatients();
    }, [getPatients])

    useEffect(() => {
        if (errMsg) {
            errRef.current?.focus();
        }
    }, [errMsg]);


    const handleSearchChange = (e) => setSearch(e.target.value)

    const filteredPatients = patients.filter(patient => {
        return search.toLocaleLowerCase() === '' ? patient : patient.patientName.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    })

    const errClass = errMsg ? "errmsg" : "offscreen"

    if(loading) {
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

    const content = (
        <div className = 'patients-list'>

            <div className="search-bar">
                <div className="search-icon"><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
                <input 
                    className="input-box"
                    type="text"
                    placeholder="search..."
                    value={search}
                    onChange={handleSearchChange}
                />
            </div>

            { filteredPatients.length === 0  ? (
                <p className="patients-list-para">Patient Not Found!</p> 
            ) : (

                <table className="patient-table">

                    <thead>
                        <tr className='patient-head'>
                            <th>Patient Name</th>
                            <th className="patient-age-style">Age</th>
                            <th className="patient-gender">Gender</th>
                            <th>Email</th>
                            <th>View</th>
                        </tr>
                    </thead>

                    <tbody>
                        <PatientsList filteredPatients={filteredPatients} />
                    </tbody>

                </table>
            ) }

        </div>
    )

    return( 
        <section>
            { patients.length > 0 && content }           
        </section>
    )
    
}

export default Patients
