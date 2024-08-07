import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { jwtDecode } from "jwt-decode";
import useAuth from "../../hooks/useAuth";
import medicalAppointment from '../../img/medical-appointment.png'
import DatePicker from 'react-date-picker';
import TimePicker from 'react-time-picker';

import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAppointment = () => {  

  const { setTrack, auth } = useAuth()

  const decode = auth?.accessToken ?
    jwtDecode(auth.accessToken)
    : undefined

  const patientName = decode.UserInfo.username

  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()

  const [healthcare, setHealthcare] = useState([])

  const [test, setTest] = useState('')
  const [isDisabled, setIsDisabled] = useState(false)
  const [loading, setLoading] = useState(false)

  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState(new Date())
  const [sTime, setStartTime] = useState('00:00')
  const [eTime, setEndTime] = useState('00:00')

  useEffect(() => {
    const getHealthcare = async () => {
      try {
        const response = await axiosPrivate.get('/healthcareprovider')
        setHealthcare(response.data)
      } catch (err) {
        console.error(err);
      }
    }
    getHealthcare()
  }, [axiosPrivate])

  const options = healthcare.map(doctor => (
      <option key={doctor._id} value={doctor.username}>
        {doctor.username}
      </option>
  ))

  const handleSubmit = async () => {
    try {
      setIsDisabled(true)
      setLoading(true)
      const response = await axiosPrivate.post('/appointments',
        JSON.stringify({ patientName, test, doctor, date, sTime, eTime }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      setTrack(response.data)
      setTest('')
      setDoctor('')
      setStartTime('')
      setEndTime('')
      toast.success('appointment added successfully!', {
        position: "top-center",
        autoClose: 1000,
        style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        },
        onClose: () => {
          navigate('/account/appointmentsuccess');
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
        toast.error(err.response.data.message, { position: "top-center",
        autoClose: 5000, theme: "light", style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        }})
      } else if (err.response.status === 409) {
        toast.error(err.response.data.message, { position: "top-center",
        autoClose: 5000, theme: "light", style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        }})
      } else {
        toast.error('Error submitting medical test', { position: "top-center",
        autoClose: 5000, theme: "light", style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        }})
      }
      window.scroll({top:0, behavior: 'smooth'})
      setIsDisabled(false)
      setLoading(false)
    }
  };


  return (
    <>
      <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>

      <section className="appointment">

        <h4>Book Your Appointment</h4>

        <div className="appointment-container">

          <div className="medical-appointment">
              <img src={medicalAppointment} alt="Healthcare" />
              <h5>Medical Information</h5>
          </div>
          
          <form>

            <label>PatientName:</label>
            <input type="text" className="Patient-name-inactive" value={patientName} readOnly/>

            <label>Test:</label>
            <select value={test} onChange={(e) => setTest(e.target.value)}>
              <option value=''>Select your test</option>
              <option value='Complete Blood Count (CBC)'>Complete Blood Count (CBC)</option>
              <option value='Blood Glucose Test'>Blood Glucose Test</option>
              <option value='Lipid Panel'>Lipid Panel</option>
              <option value='Liver Function Tests (LFTs)'>Liver Function Tests (LFTs)</option>
              <option value='Thyroid Function Tests'>Thyroid Function Tests</option>
              <option value='Urinalysis'>Urinalysis</option>
              <option value='Electrocardiogram (ECG or EKG)'>Electrocardiogram (ECG or EKG)</option>
              <option value='Mammogram'>Mammogram</option>
              <option value='Pap Smear (Pap Test)'>Pap Smear (Pap Test)</option>
              <option value='Colonoscopy'>Colonoscopy</option>
            </select>

            <h5>Availability</h5>

            <label>Healthcare Provider:</label>
            <select value={doctor} onChange={(e) => setDoctor(e.target.value)}>
              <option value=''>Select</option>
              {options}
            </select>

            <label>Date:</label>
            <DatePicker
              className="datepicker"
              value={date}
              onChange={(date) => setDate(date)}
              dateFormat="yyyy-MM-dd"
            >
            </DatePicker>

            <h5 className="time-duration">Select Time from 8AM - 5PM</h5>

            <label>Time from:</label>
            <TimePicker
              className='timepicker'
              value={sTime}
              onChange={(time) => setStartTime(time)}
            >
            </TimePicker>

            <label>Time to:</label>
            <TimePicker
              className='timepicker timepick'
              value={eTime}
              onChange={(time) => setEndTime(time)}
            >
            </TimePicker>

            <button className='app-btn' type="button" onClick={handleSubmit} disabled={isDisabled}>Submit</button>
          </form>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
        />
      </section>
    </>
  )
}

export default AddAppointment;
