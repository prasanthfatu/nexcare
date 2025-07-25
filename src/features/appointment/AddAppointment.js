import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { jwtDecode } from "jwt-decode";
import useAuth from "../../hooks/useAuth";
import medicalAppointment from '../../img/medical-appointment.png'
import DatePicker from 'react-date-picker';

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
  const [availableTimes, setAvailableTimes] = useState([]);
  const [finding, setFinding] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)

  const [doctor, setDoctor] = useState('')
  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState('')
  const [errDate, setErrDate] = useState('')
  const [errTime, setErrTime] = useState('')

  const [isFocused, setIsFocused] = useState({
    focusName: false,
    focusTest: false,
    focusDoctor: false,
  });

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const selectedDateString = new Date(date).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/kolkata' }))

  const enabledSlots = availableTimes.filter((t) => {
  const cleanTime = t.trim().replace(/(AM|PM)$/, ' $1');
  const [timer, modifier] = cleanTime.split(' ');
  let [hours, minutes] = timer.split(':').map(Number);
  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  const slotTime = new Date(now);
  slotTime.setHours(hours, minutes, 0, 0);
  slotTime.setSeconds(0, 0);

  // Disable only if slot is in the past and selected date is today
  const isPast = today === selectedDateString && slotTime <= now;

  return !isPast; // Keep only active (not disabled) slots
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

  const fetchAvailableTimes = useCallback(async() => {
    setHasFetched(false)
    setAvailableTimes([])
    setErrTime('')
      if(!date) return
      try {
          setFinding(true)
          const dateKey = date.toLocaleDateString('en-CA', {
            timeZone: 'Asia/kolkata'
          })
          const response = await axiosPrivate.post('/available',
          JSON.stringify({ doctor, dateKey }));
          setAvailableTimes(response.data.availableTimes)
      } catch (err) {
        console.log(err)
        setErrTime(err.response.data.message || 'Server error try again')
        setAvailableTimes([])
      } finally {
        setHasFetched(true)
        setFinding(false)
      }
    }, [date, doctor, axiosPrivate])

  useEffect(() => {
    setHasFetched(false)
    setAvailableTimes([])
    setTime('')
  }, [date, doctor])

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

    const selectedDate = date.toLocaleDateString('en-CA', {
      timeZone: 'Asia/kolkata'
    })
    
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
        JSON.stringify({ patientName, test, doctor, date: selectedDate, time }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      setTrack(response.data)
      setTest('')
      setDoctor('')
      setDate('')
      setTime('')
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
    } finally {
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

  const isVallidDate = (datevalue) => {
    setErrDate('')
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/kolkata' })
    const selectedDateString = new Date(datevalue).toLocaleDateString('en-CA', { timeZone: 'Asia/kolkata' })
   
    if(!datevalue) {
      setErrDate('Please select date')
    }else if(today > selectedDateString){
      setErrDate('Selected date is expired')
    }
  }

   const content = (
      <div className='dash-outlet'>
        <style>
            {
              `@keyframes ripple-effect {
                to {
                  transform: scale(2);
                  opacity: 1
                }
              }
              @keyframes spin {
                0% { transform: rotate(0deg)}
                100% { transform: rotate(360deg)}
              }  
              `
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
                  style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusName || patientName !== '') ? '20px' : '48px', left: (isFocused.focusName || patientName !== '') ? '30px' : '30px', fontSize: (isFocused.focusName || patientName !== '') ? '13px' : '16px', cursor: 'not-allowd'}}
                >PatientName</label>
  
                <input  
                  style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px', cursor: 'not-allowed'}}
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
  
                  <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusTest || test !== '') ? '20px' : '48px', left: (isFocused.focusTest || test !== '') ? '30px' : '30px', fontSize: (isFocused.focusTest || test !== '') ? '13px' : '16px', pointerEvents: 'none'}}>Test</label>
  
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

                  {!test && (
                  <div
                    style={{ position: 'absolute', top: '82px', left: '10px', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', color: 'red', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10,transition: 'opacity 0.3s ease', opacity: !test ? 1 : 0
                    }}
                  >
                    please select test
                  </div>                                    
                  )}          
  
                </div>  
  
              {/* Healthcare Provider */}
              <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px', marginBottom: '10px'}}>
  
                <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusDoctor || doctor !== '') ? '20px' : '48px', left: (isFocused.focusDoctor || doctor !== '') ? '30px' : '30px', fontSize: (isFocused.focusDoctor || doctor !== '') ? '13px' : '16px', pointerEvents: 'none'}}>Healthcare Provider</label>
  
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

                {!doctor && (
                  <div
                    style={{ position: 'absolute', top: '82px', left: '10px', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', color: 'red', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10,transition: 'opacity 0.3s ease', opacity: !doctor ? 1 : 0
                    }}
                  >
                    please select healthcare provider
                  </div>                                    
                  )}         
  
              </div>  
  
            </div>

            <div>

              <div style={{position: 'relative', marginBottom: '10px'}}>
                 <label style={{color: 'gray', fontSize: '13px'}}>Date</label>
                <br />
  
                  <DatePicker
                    className="datepicker"
                    value={date}
                    onChange={(date) => { 
                      setDate(date)
                      isVallidDate(date) 
                    }}
                    dateFormat="yyyy-MM-dd"
                  >
                  </DatePicker>
                  {errDate && (
                  <div
                    style={{ position: 'absolute', top: '72px', left: '10px', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', color: 'red', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10,transition: 'opacity 0.3s ease', opacity: errDate ? 1 : 0, marginTop: '10px'}}
                  >
                    {errDate}
                  </div>                                    
                  )}  
              </div>    
  
                 
                <div style={{marginTop: '30px', width: '100%', height: 'fit-content' }}>
                  <label style={{color: 'gray', fontSize: '13px'}}>
                    Time
                  </label>
                  <br />
                  <button
                    type="button"
                    onClick={fetchAvailableTimes}
                    disabled = {!date || !doctor || errDate}
                    style={{ width: '215px', padding: '10px 16px', color: 'black', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: (!date || !doctor || errDate) ? 'not-allowed' : 'pointer',boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)', transition: 'background-color 0.3s ease', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, position: 'relative'
                    }}
                  >
                    {finding ? 'finding time slots' : 'Check Availability'}
                    {finding && <span style={{ position: 'absolute', top: '25%', left: '12px', width: '20px', height: '20px', border: '5px solid black', borderTop: '5px solid transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite'}}></span>}
                  </button>
                  <span style={{ display: (!doctor || !date) ? 'block' : 'none', marginLeft: '10px', color: 'red', fontSize: '14px', cursor: 'default', fontFamily: 'monospace'}}>required - Healthcare Provider & Date to find available time slots</span>
                  {errTime && (<p style={{color: 'red'}}>{errTime}</p>)}
                </div>

                  <div className="time-slots">
                      {doctor && date && (

                          hasFetched && (
                        Array.isArray(availableTimes) && availableTimes.length > 0 ? (

                          enabledSlots.length === 0 ? (
                             <p style={{ marginLeft: '10px', marginTop: 0, color: 'red', fontSize: '14px', cursor: 'default', fontFamily: 'monospace' }}>
                              All time slots have passed for today.
                            </p>
                          ) : (
                          
                          availableTimes.map((t) => {

                            const [timer, modifier] = t.split(' ')
                            let [hours, minutes] = timer.split(':').map(Number)
                            if(modifier === 'PM' && hours < 12) hours += 12
                            if(modifier === 'AM' && hours === 12) hours = 0
                            const slotTime = new Date(now)
                            slotTime.setHours(hours, minutes, 0, 0)
                            const isPast = today === selectedDateString && slotTime <= now
                            
                            return(
                            <button
                              key={t}
                              type="button"
                              onClick={() => setTime(t)}
                              disabled = {isPast}
                              style={{
                                padding: '8px 12px',
                                margin: '5px',
                                backgroundColor: time === t ? '#4CAF50' : '#f0f0f0',
                                border: '1px solid #ccc',
                                cursor: isPast ? 'not-allowed' : 'pointer',
                                opacity: isPast ? 0.5 : 1
                              }}
                            >
                              {t}
                            </button>)
                          })
                        )) : (
                          <p style={{ marginLeft: '10px', color: 'red', fontSize: '14px', cursor: 'default', fontFamily: 'monospace' }}>No available time slots for this date</p>
                        ))
                  
                      )}
                  </div>

                  <button ref={rippleRef} className='app-btn' type="button" onClick={handleSubmit} disabled={isDisabled} style={{position: 'relative', backgroundColor: processing ? '#4aa0fc' : '#218bff', cursor: processing ? 'not-allowed' : 'pointer', overflow:'hidden', marginBottom: '10px', marginTop: '25px'}}>
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
      </ div>
    )

  return options.length > 0 ? content : <p style={{color: dark ? '#EAEAEA' : 'black'}}>Doctors not found.</p>

}

export default AddAppointment;
