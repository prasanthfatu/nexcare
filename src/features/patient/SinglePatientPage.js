import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faAddressBook, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import useAxiosPrivate from "../../hooks/useAxiosPrivate"

const SinglePatientPage = () => {

    const { patientId } = useParams()

    const axiosPrivate = useAxiosPrivate()
    const [patient, setPatient] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchSinglePatient = async () => {
            setLoading(true)
            try {
                const response = await axiosPrivate.get(`/tests/${patientId}`)
                setPatient(response.data)
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false)
            }
        }
        fetchSinglePatient()
    }, [axiosPrivate, patientId])

    if(loading) {
        return <p>Loading...</p>
    }

    if (!patient) {
        return (
            <section>
                <p>Patient not found!</p>
            </section>
        )
    }

    return (
        <section className="singlepage-patient">

            <div className="patient-details">

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

            <div className="emergency-details">

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
                <div className="patient-update-icon"><Link to={`/account/patients/edit/${patient._id}`}><FontAwesomeIcon icon={faPenToSquare} /></Link></div>
            </div>

        </section>
    )
}

export default SinglePatientPage
