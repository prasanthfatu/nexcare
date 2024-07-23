import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

const PatientsList = ({filteredPatients}) => {

  return (
    <>
      {
        filteredPatients.map((patient) => {

          const {_id, patientName, age, gender, email} = patient   

          return(
        
            <tr key={_id} className="patient-body">
              <td className="patientName-style">{patientName}</td>
              <td className="patient-age-style">{age}</td>
              <td className="patient-gender">{gender}</td>
              <td className='patient-email-style'>{email}</td>
              <td><Link to={`/account/patients/${_id}`}><FontAwesomeIcon icon={faCircleInfo} /></Link></td>
            </tr>

          )

        })
        
      }
    </>  
  )
}

export default PatientsList
