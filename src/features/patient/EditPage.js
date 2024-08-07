import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFloppyDisk, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { useNavigate } from "react-router-dom"

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditPage = ({ patient, patientId }) => {

  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [loading, setLoading] = useState(false)

  const [patientName, setPatientName] = useState(patient?.patientName)
  const [age, setAge] = useState(patient?.age)
  const [gender, setGender] = useState(patient?.gender)
  const [maritalStatus, setMaritalStatus] = useState(patient?.maritalStatus)
  const [address, setAddress] = useState(patient?.address)
  const [email, setEmail] = useState(patient?.email)
  const [phone, setPhone] = useState(patient?.phone)
  const [fullname, setFullName] = useState(patient?.fullname)
  const [relationship, setRelationship] = useState(patient?.relationship)
  const [emerPhone, setEmerPhone] = useState(patient?.emerPhone)

  const savePatient = async () => {
    try {
      setLoading(true)
      await axiosPrivate.put(`/tests`,
        JSON.stringify({ patientId, patientName, age, gender, address, email, phone, maritalStatus, fullname, relationship, emerPhone })
      )
      setPatientName('')
      setAge('')
      setGender('')
      setMaritalStatus('')
      setAddress('')
      setEmail('')
      setPhone('')
      setFullName('')
      setRelationship('')
      setEmerPhone('')
      toast.success('Patient information updated successfully!', {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        },
        onClose: () => {
          navigate(`/account/patients/${patientId}`)
        }
    })
    } catch (err) {
      console.error(err);
      if (!err.response) {
        toast.error('Server Unreachable', { position: "top-center",
        autoClose: 5000, theme: "light", style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        }})
      } else if (err.response.status === 400) {
        toast.error('Bad Request', { position: "top-center",
        autoClose: 5000, theme: "light", style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        }})
      } else if (err.response.status === 409) {
        toast.error('Duplicate Patient Name', { position: "top-center",
        autoClose: 5000, theme: "light", style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        }})
      } else {
        toast.error('Error Updating patient details.', { position: "top-center",
        autoClose: 5000, theme: "light", style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        }})
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  const deletePatient = async () => {
    setConfirmDelete(false)
    try {
      setLoading(true)
      await axiosPrivate.delete(`/tests/${patientId}`)
      toast.success('Patient deleted successfully!', {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        },
        onClose: () => {
          navigate('/account/patients')
        }
    })
    } catch (err) {
    console.error(err)
    if (!err.response) {
      toast.error('Server Unreachable', { position: "top-center",
      autoClose: 5000, theme: "light", style: {
        width: 'auto',
        height: 'auto',
        fontSize: "0.8rem"
      }})
    } else {
      toast.error('Error Deleting Medical Test', { position: "top-center",
      autoClose: 5000, theme: "light", style: {
        width: 'auto',
        height: 'auto',
        fontSize: "0.8rem"
      }})
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    setLoading(false)
  }
  }

  return (
    <section className='patient-editpage'>
      <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>

      <div className="patient-editpage-center">

        <h1>Update Patient</h1>

        <form className='form'>

          <label>
            Patient Name:
          </label>
          <input type="text" name="patientName" autoComplete='off' value={patientName} onChange={(e) => setPatientName(e.target.value)} required />


          <label>
            Age:
          </label>
          <input type="number" name="age" value={age} onChange={(e) => setAge(e.target.value)} required />


          <label>
            Gender:
          </label>
          <select name="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label>Marital Status:</label>
          <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
            <option value=''>Select</option>
            <option value='Single'>Single</option>
            <option value='Married'>Married</option>
            <option value='Divorced'>Divorced</option>
            <option value='Widowed'>Widowed</option>
          </select>

          <label>Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          >
          </textarea>

          <label>
            Email:
          </label>
          <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>
            Mobile Number:
          </label>
          <input type='number' value={phone} onChange={(e) => setPhone(e.target.value)} />

          <h4>Emergency Contact</h4>
          <label>Full Name:</label>
          <input type='text' value={fullname} onChange={(e) => setFullName(e.target.value)} />

          <label>Relationship:</label>
          <select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
            <option value=''>Select</option>
            <option value='Spouse'>Spouse</option>
            <option value='Parent'>Parent</option>
            <option value='Sibiling'>Sibiling</option>
          </select>

          <label>Emergency Phone Number:</label>
          <input type='number' value={emerPhone} onChange={(e) => setEmerPhone(e.target.value)} />

          <div className="btn-container">
            <button className="patient-save-btn" type="button" onClick={savePatient}><FontAwesomeIcon icon={faFloppyDisk} /></button>
            <button className="patient-delete-btn" type="button" onClick={() =>setConfirmDelete(true)}><FontAwesomeIcon icon={faTrash} /></button>
          </div>

        </form>

        <div>
        {
              confirmDelete && (
                <div className="confirm-delete">  
                  <div className="xmark-icon"><div className='xmark-pointer' onClick={() => setConfirmDelete(false)}><FontAwesomeIcon icon={faXmark} /></div></div>
                  <p>Do you want to delete?</p> 
                    <div className="confirm-delete-btn">
                      <button type='button' onClick={deletePatient}>yes</button>
                      <button type='button' onClick={() => setConfirmDelete(false)}>no</button>
                    </div>
                </div>  
                )
          }
        </div>

        <ToastContainer />

      </div>

    </section>

  )
}

export default EditPage
