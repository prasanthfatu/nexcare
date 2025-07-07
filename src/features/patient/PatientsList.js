import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import useAuth from "../../hooks/useAuth"

const PatientsList = ({currentItems}) => {

  const {dark} = useAuth()  
  
  return (
    <>
      {
        currentItems.map((patient) => {

          const {_id, patientName, age, gender, email} = patient   

          return(
        
            <tr key={_id} className="patient-body">
              <td className="patientName-style" style={{color: dark ? '#777777' : 'black'}}>{patientName}</td>
              <td className="patient-age-style" style={{color: dark ? '#777777' : 'black'}}>{age}</td>
              <td className="patient-gender" style={{color: dark ? '#777777' : 'black'}}>{gender}</td>
              <td className='patient-email-style' style={{color: dark ? '#777777' : 'black'}}>{email}</td>
              <td><Link to={`/account/patients/${_id}`}><FontAwesomeIcon icon={faCircleInfo} style={{color: dark ? '#777777' : 'black'}} /></Link></td>
            </tr>

          )

        })
        
      }
    </>  
  )
}

export default PatientsList
