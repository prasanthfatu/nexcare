import { useState, useEffect, useRef, useCallback } from "react"
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

  const fetchErrRef = useRef(null)
  const rippleRef = useRef()
  const [fetchErrMsg, setFetchErrMsg] = useState('')
  const [processing, setProcessing] = useState(false)

  const { setTrack, auth, dark } = useAuth()

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
  const [fetchLoading, setFetchLoading] = useState(false)

  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState(new Date())
  const [sTime, setStartTime] = useState('00:00')
  const [eTime, setEndTime] = useState('00:00')

  const [isFocused, setIsFocused] = useState({
        focusName: false,
        focusTest: false,
        focusDoctor: false,
      });

  const getHealthcare = useCallback(async () => {
      setFetchLoading(true)
      setFetchErrMsg('')
      try {
        const response = await axiosPrivate.get('/healthcareprovider')
        setHealthcare(response.data)
      } catch (err) {
        console.error(err);
        if (!err.response) {
          setFetchErrMsg('Server Unreachable');
        } else if(err.response.status === 400){
          setFetchErrMsg(err.response.data.message);
        } else {
          setFetchErrMsg(err.data?.message || 'Error fetching data from server.');
        }
      } finally{
        setFetchLoading(false)
      }
  }, [axiosPrivate])

  useEffect(() => {
    getHealthcare()
  }, [getHealthcare])

  useEffect(() => {
    if (fetchErrRef) {
        fetchErrRef.current?.focus();
    }
  }, [fetchErrRef]);

  const options = healthcare.length > 0 && healthcare.map((doctor) => (
      <option key={doctor._id} value={doctor.username}>
        {doctor.username}
      </option>
  ))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const button = rippleRef.current

    const ripple = document.createElement('span')
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter /2
    ripple.style.width = ripple.style.height = `${diameter}px`
    ripple.style.position = `absolute`
    ripple.style.left = `${e.nativeEvent.offsetX - radius}px`
    ripple.style.top = `${e.nativeEvent.offsetY - radius}px`
    ripple.style.background = `rgba(255, 255, 255, 0.2)`
    ripple.style.borderRadius = '50%'
    ripple.style.opacity = 1
    ripple.style.transform = 'scale(0)'
    ripple.style.animation = `ripple-effect 600ms ease`

    const existRipple = button.querySelector('span')
    if(existRipple) existRipple.remove()
     
    button.appendChild(ripple)  

    try {
      setIsDisabled(true)
      setLoading(true)
      setProcessing(true)
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
      setDate('')
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
      setProcessing(false)
    }
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({
      ...prev, [field]: true
    }))
  }

  const handleBlur = (field) => {
    setIsFocused((prev) => ({
      ...prev, [field]: false
    }))
  }

  if(fetchLoading){
     return(
      <>
        <div className={`data-loading ${fetchLoading ? 'active' : 'inactive'}`}></div>
        <p style={{color: dark ? '#EAEAEA' : 'black'}}>Please wait...</p>
      </>
    )
  }

  const fetchErrClass = fetchErrMsg ? "errmsg" : "offscreen"

    if (fetchErrMsg) {
      console.log(fetchErrMsg);
      
        return (
            <section style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0'}}>
                <p ref={fetchErrRef} className={fetchErrClass} aria-live="assertive" style={{cursor: 'default'}}>{fetchErrMsg}</p>
                <p style={{color: dark ? 'gray' : 'black', margin: '0.25rem 0 1rem', cursor: 'default'}}>Could not retrieve information</p>
                <button onClick={getHealthcare} style={{cursor: 'pointer', fontSize: '12px', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', fontWeight: 'bold'}}>Retry</button>
            </section>
        )
    }

     const styles = {
    darklabel: {
      color: 'gray', position: 'absolute', transform: 'translate(0, -50%)', backgroundColor: '#0D0D0D', zIndex: 1, transition: 'top 0.3s linear', padding: '2px 5px', marginLeft: '1.5px'
    },
    lightlabel: {
      color: 'gray', position: 'absolute', transform: 'translate(0, -50%)', backgroundColor: '#fff', zIndex: 1, transition: 'top 0.3s linear', padding: '2px 5px', marginLeft: '1.5px'
    },
  }  

   const content = (
      <>
        <style>
            {
              `@keyframes ripple-effect {
                to {
                  transform: scale(2);
                  opacity: 1
                }
              }`
            }
        </style>
  
        <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>
  
        <section className="appointment">
         
          <h4 style={{color: dark ? '#EAEAEA' : 'black'}}>Book Your Appointment</h4>
  
          <div className="appointment-container" style={{backgroundColor: dark ? '#0D0D0D' : '#fff', border: dark ? '0.01px solid #333333' : '0.01px solid #ccc', width: '100%'}}>
  
            <div className="medical-appointment">
                <img src={medicalAppointment} alt="Healthcare" />
                <h5 style={{color: dark ? '#EAEAEA' : 'black'}}>Medical Information</h5>
            </div>
            
            <form className="newappointment-form">
  
             <div>
  
                {/* Patient Name */}
              <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>
  
                <label 
                  style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusName || patientName !== '') ? '20px' : '48px', left: (isFocused.focusName || patientName !== '') ? '30px' : '30px', fontSize: (isFocused.focusName || patientName !== '') ? '13px' : '16px'}}
                >PatientName</label>
  
                <input  
                  style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                  onFocus={() => handleFocus('focusName')}
                  onBlur={() => handleBlur('focusName')}
                  type="text" 
                  className="Patient-name-inactive" 
                  value={patientName} 
                  readOnly
                />
  
              </div>
  
                {/* Test */}
                <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>
  
                  <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusTest || test !== '') ? '20px' : '48px', left: (isFocused.focusTest || test !== '') ? '30px' : '30px', fontSize: (isFocused.focusTest || test !== '') ? '13px' : '16px'}}>Test</label>
  
                  <select 
                    style={{backgroundColor: dark ? '#0D0D0D' : 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                    onFocus={() => handleFocus('focusTest')}
                    onBlur={() => handleBlur('focusTest')} 
                    value={test} 
                    onChange={(e) => setTest(e.target.value)}
                  >
                    <option value=''></option>
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
  
                </div>  
  
              {/* Healthcare Provider */}
              <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>
  
                <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusDoctor || doctor !== '') ? '20px' : '48px', left: (isFocused.focusDoctor || doctor !== '') ? '30px' : '30px', fontSize: (isFocused.focusDoctor || doctor !== '') ? '13px' : '16px'}}>Healthcare Provider</label>
  
                <select 
                  style={{backgroundColor: dark ? '#0D0D0D' : 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                  onFocus={() => handleFocus('focusDoctor')}
                  onBlur={() => handleBlur('focusDoctor')} 
                  value={doctor} 
                  onChange={(e) => setDoctor(e.target.value)}
                >
                  <option value=''></option>
                  {options}
                </select>
  
              </div>  
  
             </div>
  
            <div>
                <h5 style={{color: dark ? '#EAEAEA' : 'black', marginTop: '10px'}}>Availability</h5>
  
                <label style={{color: 'gray', fontSize: '13px'}}>Date</label>
                <br />
  
                  <DatePicker
                    className="datepicker"
                    value={date}
                    onChange={(date) => setDate(date)}
                    dateFormat="yyyy-MM-dd"
                  >
                  </DatePicker>
  
                <h5 className="time-duration" style={{color: dark ? '#EAEAEA' : 'black'}}>Select Time from 8AM - 5PM</h5>
  
                <label style={{color: 'gray', fontSize: '13px'}}>Time from</label>
                <TimePicker
                  className='timepicker'
                  value={sTime}
                  onChange={(time) => setStartTime(time)}
                >
                </TimePicker>
  
                <label style={{color: 'gray', fontSize: '13px'}}>Time to</label>
                <TimePicker
                  className='timepicker timepick'
                  value={eTime}
                  onChange={(time) => setEndTime(time)}
                >
                </TimePicker>
  
                <button ref={rippleRef} className='app-btn' type="button" onClick={handleSubmit} disabled={isDisabled} style={{position: 'relative', backgroundColor: processing ? '#4aa0fc' : '#218bff', cursor: processing ? 'not-allowed' : 'pointer', overflow:'hidden', marginBottom: '10px'}}>
                  {processing && <span style={{width: '20px', height: '20px', border: '1px solid white', borderTop: '1px solid transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite'}} />}
                  {processing ? 'Processing...' : 'Submit'}
                </button>
  
            </div>
            </form>
          </div>
          <ToastContainer
              position="top-right"
              autoClose={5000}
          />
        </section>
      </>
    )

  return options.length > 0 ? content : <p style={{color: dark ? '#EAEAEA' : 'black'}}>Doctors not found.</p>

}

export default AddAppointment;
