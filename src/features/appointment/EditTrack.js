import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const EditTrack = ({filteredStatus, dark, setDelPopup, setAppointmentId}) => {

  const handleDel = (appId) => {
    setDelPopup(true)
    setAppointmentId(appId)
  }

  return (
    <>
      {
        filteredStatus.map((currentStatus) => {
          const { test, status, time, date, _id } = currentStatus
          return(
            <tr key={_id} className="track-body">
              <td style={{color: dark ? '#777777' : 'white', backgroundColor: dark ? '#0D0D0D' : '#777777'}} className='track-body-test'>{test}</td>
              <td style={{color: dark ? '#777777' : 'white', backgroundColor: dark ? '#0D0D0D' : '#777777'}} className="track-date-style">{date}</td>
              <td style={{color: dark ? '#777777' : 'white', backgroundColor: dark ? '#0D0D0D' : '#777777'}} className="track-time">{time}</td>
              <td style={{color: dark ? '#777777' : 'white', backgroundColor: dark ? '#0D0D0D' : '#777777'}}>{status}</td>
              <td style={{backgroundColor: dark ? '#0D0D0D' : '#777777'}} className="track-cursor" onClick={() => handleDel(_id)}>
                <FontAwesomeIcon icon={faTrash} style={{color: 'red'}} />
              </td>
            </tr>
          )
        })
        
      }
    </>  
  )
}

export default EditTrack
