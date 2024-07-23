import { useEffect, useState, useCallback } from "react"
import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import PatientsList from "./PatientsList"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const Patients = () => {

    const { patients, setPatients} = useAuth()
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const axiosPrivate = useAxiosPrivate()

    const getPatients = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axiosPrivate.get('/tests');
            setPatients(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false)
        }

    }, [axiosPrivate, setPatients])

    useEffect(() => {       
        getPatients();
    }, [getPatients])

    const handleSearchChange = (e) => setSearch(e.target.value)

    const filteredPatients = patients.filter(patient => {
        return search.toLocaleLowerCase() === '' ? patient : patient.patientName.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    })

    if(loading) {
        return <p>Loading...</p>
    }

    const content = (
        <div className = 'patients-list'>

            <div className="search-bar">
                <div className="search-icon"><FontAwesomeIcon icon={faMagnifyingGlass} /></div>
                <input 
                    className="input-box"
                    type="text"
                    placeholder="search..."
                    onChange={handleSearchChange}
                />
            </div>

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
            
        </div>
    )

    return (patients.length > 0) ? content : <p>Patients Not Found!</p>
}

export default Patients
