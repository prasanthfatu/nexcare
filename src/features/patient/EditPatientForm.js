import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import EditPage from "./EditPage"

const EditPatientForm = () => {

  const {patientId} = useParams()
  const axiosPrivate = useAxiosPrivate()
  const [patient, setPatient] = useState([])

  useEffect(() => {
    const fetchPatient = async() => {
      try {
        const response = await axiosPrivate.get(`/tests/${patientId}`)
        setPatient(response.data)
      } catch (err) {
        console.error(err);
      }
    }
    fetchPatient()
  }, [axiosPrivate, patientId])

  const content = patient && <EditPage key={patient._id} patient={patient} patientId={patientId} />

  return (
    <>
      {content}
    </>
  )
}

export default EditPatientForm