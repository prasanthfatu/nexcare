import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

const EditTrack = ({filteredStatus, deleteAppointment}) => {

  return (
    <>
      {
        filteredStatus.map((currentStatus) => {
          const { test, status, startTime, endTime, _id } = currentStatus
          const date = moment(startTime).format('YYYY-MM-DD')
          const sTime = moment(startTime).format('HH:mm')
          const eTime = moment(endTime).format('HH:mm')
        
          return(
            <tr key={_id} className="track-body">
              <td className='track-body-test'>{test}</td>
              <td className="track-date-style">{date}</td>
              <td className="track-time">{sTime} - {eTime}</td>
              <td>{status}</td>
              <td className="track-cursor" onClick={() =>deleteAppointment(_id)}><FontAwesomeIcon icon={faTrash} /></td>
            </tr>
          )
        })
        
      }
    </>  
  )
}

export default EditTrack
