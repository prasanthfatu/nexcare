import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import useAuth from "../../hooks/useAuth"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import PatientsList from "./PatientsList"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Breadcrumbs from "../../components/Breadcrumbs"
import { useLocation } from "react-router-dom"

const Patients = () => {

    const location = useLocation()
    const errRef = useRef(null)
    const debounceRef = useRef(null)
    const [errMsg, setErrMsg] = useState('')

    const { patients, setPatients, dark} = useAuth()
    const [loading, setLoading] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')

    const axiosPrivate = useAxiosPrivate()

    const [currentPage, setCurrentPage] = useState(1)

    const itemsPerPage = 5

    const startIndex = (currentPage - 1) * itemsPerPage

    const endIndex = startIndex + itemsPerPage

    const getPatients = useCallback(async () => {
        try {
            setLoading(true)
            setErrMsg('')
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

    const debounceFunction = useCallback((func, timer) => {
        return (...args) => {
            if(debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
            debounceRef.current = setTimeout(() => {
                func(...args)
            }, timer)
        }
    }, [])

    const searchPatient = useCallback((query) => {
        setSearch(query)
    }, [setSearch])

    const debouncSearchFunction = useMemo(() => debounceFunction(searchPatient, 500), [searchPatient, debounceFunction])
 
    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchInput(value)
        debouncSearchFunction(value)
        setCurrentPage(1)
    }

    const filteredPatients = patients.filter(patient => {
        return search === '' ? patient : patient.patientName.toLowerCase().includes(search.toLowerCase())
    })

    const currentItems = filteredPatients.slice(startIndex, endIndex)
    
    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)

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

                <button onClick={getPatients} style={{cursor: 'pointer', fontSize: '12px', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', fontWeight: 'bold'}}>Retry</button>

            </section>
        
        )
    }

    const content = (
        <div className = 'patients-list' style={{backgroundColor: dark ? 'black' : 'aliceblue',}}>

            <div className="search-bar" style={{border: dark ? '0.01px solid #333333' : '0.1px solid #ccc', position: 'relative'}}>
                <div className="search-icon" style={{position: 'absolute', top: '50%', left: '10%', transform: 'translate(-50%, -50%)'}}><FontAwesomeIcon icon={faMagnifyingGlass} style={{color: dark ? '#333333' : 'black', fontSize: '12.5px'}} /></div>
                <input 
                    className="input-box"
                    style={{position: 'absolute', top: '50%', left: '15%', transform: 'translate(0, -50%)', caretColor: dark ? 'gray' : 'black', color: dark ? 'gray' : 'black'}}
                    type="text"
                    placeholder="search..."
                    value={searchInput}
                    onChange={handleSearchChange}
                />
            </div>

            { filteredPatients.length === 0  ? (
                <p className="patients-list-para">Patient Not Found!</p> 
            ) : (
                <div style={{height: '390px'}}>
                    <table className="patient-table">
                    
                        <thead>
                            <tr className='patient-head'>
                                <th style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}}>Patient Name</th>
                                <th className="patient-age-style" style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}}>Age</th>
                                <th className="patient-gender" style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}}>Gender</th>
                                <th style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}}>Email</th>
                                <th style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}}>View</th>
                            </tr>
                        </thead>

                        <tbody>
                            <PatientsList currentItems = {currentItems} />
                        </tbody>

                    </table>
                </div>
            ) }

            {
                filteredPatients.length > 0 && (
                    
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
                    <button
                        style={{ cursor: 'pointer', padding: '0.25rem 0.5rem', border: dark ? '0.01px solid #333333' : '0.01px solid #ccc', borderRadius: '10px'}}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled = {currentPage === 1}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <button
                        style={{ cursor: 'pointer', padding: '0.25rem 0.5rem', border: dark ? '0.01px solid #333333' : '0.01px solid #ccc', borderRadius: '10px'}}
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled = {currentPage === totalPages}
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                    </div>
                )
            }

        </div>
    )

    return (
        <section className='dash-outlet'>
            <Breadcrumbs pathname={location.pathname} />
            {patients.length > 0 
                ? content 
                : <p style={{color: dark ? '#EAEAEA' : 'black'}}>No patients available.</p>
            }
        </section>
   );

    
}

export default Patients
