import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import addnewpatient from '../../img/+patient.png';
import useAuth from '../../hooks/useAuth';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TestForm = () => {
  const [processing, setProcessing] = useState(false)
  const rippleRef = useRef()
  const {dark} = useAuth()

  const navigate = useNavigate()
  const axiosPrivate = useAxiosPrivate()

  const [patientName, setPatientName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [maritalStatus, setMaritalStatus] = useState('')
  const [fullname, setFullName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [emerPhone, setEmerPhone] = useState('')

  const [loading, setLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false);
  const [isFocused, setIsFocused] = useState({
    focusName: false,
    focusAge: false,
    focusGender: false,
    focusMaritalStatus: false,
    focusAddress: false,
    focusPhone: false,
    focusEmail: false,
    focusFullName: false,
    focusRelationship: false,
    focusEmerPhone: false
  });

  const toastOptions = {
    position: "top-center",
    autoClose: 5000,
    theme: "light",
    style: {
      width: 'auto',
      height: 'auto',
      fontSize: "0.8rem"
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const button = rippleRef.current

    const ripple = document.createElement('span')
    const diameter = Math.max(button.clientWidth, button.clientHeight)
    const radius = diameter / 2
    ripple.style.width = ripple.style.height = `${diameter}px`
    ripple.style.position = `absolute`
    ripple.style.left = `${e.nativeEvent.offsetX - radius}px`
    ripple.style.top = `${e.nativeEvent.offsetY - radius}px`
    ripple.style.background = 'rgba(255, 255, 255, 0.2)'
    ripple.style.borderRadius = `50%`
    ripple.style.opacity = 1
    ripple.style.transform = `scale(0)`
    ripple.style.animation = `ripple-effect 600ms ease`

    const existRipple = button.querySelector('span')
    if(existRipple) existRipple.remove()
    button.appendChild(ripple)

    try {
      setIsDisabled(true)
      setLoading(true)
      setProcessing(true)
      await axiosPrivate.post('/medicaltest',
        JSON.stringify({ patientName, age, gender, address, email, phone, maritalStatus, fullname, relationship, emerPhone }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      setPatientName('')
      setAge('')
      setGender('')
      setAddress('')
      setEmail('')
      setPhone('')
      setMaritalStatus('')
      setFullName('')
      setRelationship('')
      setEmerPhone('')
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Patient Information Added successfully!', {
        position: "top-center",
        autoClose: 2000,
        style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        },
        onClose: () => {
          navigate('/account/patients');
        }
    })
    } catch (err) {
      console.error(err);
      if (!err.response) {
        toast.error('Server Unreachable', toastOptions)
      } else if (err.response.status === 400) {
        toast.error(err.response.data.message, toastOptions)
       } else if (err.response.status === 409) {
        toast.error('Patient Name Taken', toastOptions)
      } else {
        toast.error('Error submitting patient details.', toastOptions)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsDisabled(false)
      setLoading(false)
      setProcessing(false)
    }
  };

  const handleFocus = (field) => {
    setIsFocused((prev) => ({
      ...prev, [field] : true
    }))
  }

   const handleBlur = (field) => {
    setIsFocused((prev) => ({
      ...prev, [field] : false
    }))
  }

  const styles = {
    darklabel: {
      color: 'gray', position: 'absolute', transform: 'translate(0, -50%)', backgroundColor: '#0D0D0D', zIndex: 1, transition: 'top 0.3s linear', padding: '2px 5px', marginLeft: '1.5px'
    },
    lightlabel: {
      color: 'gray', position: 'absolute', transform: 'translate(0, -50%)', backgroundColor: '#fff', zIndex: 1, transition: 'top 0.3s linear', padding: '2px 5px', marginLeft: '1.5px'
    },
  }

  return (
    <div className='dash-outlet'>
      <style>
        {`
          @keyframes spin {
            to {
              transform: rotate(360deg)
            }
          }
          @keyframes ripple-effect {
           to{
             transform: scale(2);
             opacity: 1
           }
          }
        `}
      </style>

      <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>

      <section className='test-form'>

        <div className="test-form-container" style={{backgroundColor: dark ? '#0D0D0D' : '#fff', border: dark ? '0.01px solid #333333' : '0.01px solid #ccc', width: '100%'}}>

          <div className='new-patient'>
              <img src={addnewpatient} alt="Healthcare" />
              <h5 style={{color: dark ? '#EAEAEA' : 'black'}}>New Patient</h5>
          </div>

          <form className='patientform' onSubmit={handleSubmit}>
          
            <div style={{padding: '5px'}}>
              
            {/* Name */}

            <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>

              <label 
                style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusName || patientName !== '') ? '20px' : '48px', left: (isFocused.focusName || patientName !== '') ? '30px' : '30px', fontSize: (isFocused.focusName || patientName !== '') ? '13px' : '16px', pointerEvents: 'none'}}
              >
                Patient Name
              </label>

              <input 
                style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                onFocus={() => handleFocus('focusName')}
                onBlur={() => handleBlur('focusName')}
                type="text" name="patientName" autoComplete='off' value={patientName} onChange={(e) => setPatientName(e.target.value)} required 
              />

            </div>


            {/* Age */}
            <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>

              <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusAge || age !== '') ? '20px' : '48px', left: (isFocused.focusAge || age !== '') ? '30px' : '30px', fontSize: (isFocused.focusAge || age !== '') ? '13px' : '16px', pointerEvents: 'none'}}>
                Age
              </label>

              <input 
                style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                onFocus={() => handleFocus('focusAge')}
                onBlur={() => handleBlur('focusAge')} 
                type="number" name="age" value={age} onChange={(e) => setAge(e.target.value)} required 
              />

            </div>


            {/* Gender */}
            <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>

              <label 
                style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusGender || gender !== '') ? '20px' : '48px', left: (isFocused.focusGender || gender !== '') ? '30px' : '30px', fontSize: (isFocused.focusGender || gender !== '') ? '13px' : '16px', pointerEvents: 'none'}}>
                Select Gender
              </label>

              <select 
                style={{backgroundColor: dark ? '#0D0D0D' : 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                onFocus={() => handleFocus('focusGender')}
                onBlur={() => handleBlur('focusGender')}  name="gender" value={gender} onChange={(e) => setGender(e.target.value)} 
                required
              >
                <option value=""></option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

            </div>


            </div>

            <div style={{padding: '5px'}}>

              {/* Marital Status */}
            <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>

              <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusMaritalStatus || maritalStatus !== '') ? '20px' : '48px', left: (isFocused.focusMaritalStatus || maritalStatus !== '') ? '30px' : '30px', fontSize: (isFocused.focusMaritalStatus|| maritalStatus !== '') ? '13px' : '16px', pointerEvents: 'none'}}>Marital Status</label>

              <select  
                style={{backgroundColor: dark ? '#0D0D0D' : 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                onFocus={() => handleFocus('focusMaritalStatus')}
                onBlur={() => handleBlur('focusMaritalStatus')}
                value={maritalStatus} 
                onChange={(e) => setMaritalStatus(e.target.value)}
              >
                <option value=''></option>
                <option value='Single'>Single</option>
                <option value='Married'>Married</option>
                <option value='Divorced'>Divorced</option>
                <option value='Widowed'>Widowed</option>
              </select>

            </div>  

            {/* Address */}
            <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>

              <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusAddress || address !== '') ? '9px' : '48px', left: (isFocused.focusAddress || address !== '') ? '30px' : '30px', fontSize: (isFocused.focusAddress|| address !== '') ? '13px' : '16px', pointerEvents: 'none'}}>Address</label>

              <textarea
                style={{backgroundColor: dark ? '#0D0D0D' : 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px', resize: 'none'}}
                onFocus={() => handleFocus('focusAddress')}
                onBlur={() => handleBlur('focusAddress')}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              >
              </textarea>
            </div>  

            {/* Phone Number */}
            <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>

              <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusPhone || phone !== '') ? '20px' : '48px', left: (isFocused.focusPhone || phone !== '') ? '30px' : '30px', fontSize: (isFocused.focusPhone|| phone !== '') ? '13px' : '16px', pointerEvents: 'none'}}>
                Phone Number
              </label>

              <input  
                style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                onFocus={() => handleFocus('focusPhone')}
                onBlur={() => handleBlur('focusPhone')}  
                type='number' 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />

            </div>  

            {/* Email */}
            <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>

              <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusEmail || email !== '') ? '20px' : '48px', left: (isFocused.focusEmail || email !== '') ? '30px' : '30px', fontSize: (isFocused.focusEmail|| email !== '') ? '13px' : '16px', pointerEvents: 'none'}}>
                Email
              </label>

              <input  
                style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                onFocus={() => handleFocus('focusEmail')}
                onBlur={() => handleBlur('focusEmail')} 
                type='text'
                value={email} 
                onChange={(e) => setEmail(e.target.value)} />

            </div>  
            
            </div>

           <div style={{padding: '5px'}}>
             <h5 style={{color: dark ? '#EAEAEA' : 'black', textAlign: 'center'}} className='emergency-contact'>Emergency Contact</h5>

             {/* Full Name */}
            <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}> 

                <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusFullName || fullname !== '') ? '20px' : '48px', left: (isFocused.focusFullName || fullname !== '') ? '30px' : '30px', fontSize: (isFocused.focusFullName|| fullname !== '') ? '13px' : '16px', pointerEvents: 'none'}}>Full Name</label>

                <input 
                  style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                  onFocus={() => handleFocus('focusFullName')}
                  onBlur={() => handleBlur('focusFullName')}  
                  type='text' 
                  value={fullname} 
                  onChange={(e) => setFullName(e.target.value)} 
                />

            </div> 

            {/* Relationship */}
            <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}> 

              <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusRelationship || relationship !== '') ? '20px' : '48px', left: (isFocused.focusRelationship || relationship !== '') ? '30px' : '30px', fontSize: (isFocused.focusRelationship|| relationship !== '') ? '13px' : '16px', pointerEvents: 'none'}}>Relationship</label>

              <select 
                style={{backgroundColor: dark ? '#0D0D0D' : 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                onFocus={() => handleFocus('focusRelationship')}
                onBlur={() => handleBlur('focusRelationship')} 
                value={relationship} 
                onChange={(e) => setRelationship(e.target.value)}
              >
                <option value=''></option>
                <option value='Parent'>Parent</option>
                <option value='Spouse'>Spouse</option>
                <option value='Sibling'>Sibling</option>
                <option value='Guardian'>Guardian</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Child">Child</option>
              </select>

            </div>

            {/* Emergency Phone Number */}
            <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}> 

              <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusEmerPhone || emerPhone !== '') ? '20px' : '48px', left: (isFocused.focusEmerPhone || emerPhone !== '') ? '30px' : '30px', fontSize: (isFocused.focusEmerPhone|| emerPhone !== '') ? '13px' : '16px', pointerEvents: 'none'}}>Emergency Phone Number</label>

              <input 
                style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                onFocus={() => handleFocus('focusEmerPhone')}
                onBlur={() => handleBlur('focusEmerPhone')}  
                type='number' 
                value={emerPhone} 
                onChange={(e) => setEmerPhone(e.target.value)} 
              />
            </div>  

             <button ref={rippleRef} className='test-form-btn' type="submit" disabled={isDisabled} style={{position: 'relative', backgroundColor: processing ? '#4aa0fc' : '#218bff', cursor: processing ? 'not-allowed' : 'pointer', overflow: 'hidden',marginTop: '17px'}}>
              {processing && <span style={{width: '20px', height: '20px', border: '1px solid white', borderTop: '1px solid transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite'}} />}
              {processing ? 'Processing...' : 'Submit'}
            </button>

           </div>

          </form>

          <ToastContainer />

        </div>

      </section>
    </div>
  );


}

export default TestForm


