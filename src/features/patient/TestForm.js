import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import addnewpatient from '../../img/+patient.png';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TestForm = () => {

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsDisabled(true)
      setLoading(true)
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
        toast.error('Patient Name Taken', { position: "top-center",
        autoClose: 5000, theme: "light", style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        }})
      } else {
        toast.error('Error submitting patient details.', { position: "top-center",
        autoClose: 5000, theme: "light", style: {
          width: 'auto',
          height: 'auto',
          fontSize: "0.8rem"
        }})
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsDisabled(false)
      setLoading(false)
    }
  };

  return (
    <>
      <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>

      <section className='test-form'>

        <div className="test-form-container">

          <div className='new-patient'>
              <img src={addnewpatient} alt="Healthcare" />
              <h5>New Patient</h5>
          </div>

          <form onSubmit={handleSubmit}>

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
              Phone Number:
            </label>
            <input type='number' value={phone} onChange={(e) => setPhone(e.target.value)} />

            <label>
              Email:
            </label>
            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />

              <h5 className='emergency-contact'>Emergency Contact</h5>
              <label>Full Name:</label>
              <input type='text' value={fullname} onChange={(e) => setFullName(e.target.value)} />

              <label>Relationship:</label>
              <select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
                <option value=''>Select</option>
                <option value='Parent'>Parent</option>
                <option value='Spouse'>Spouse</option>
                <option value='Sibling'>Sibling</option>
                <option value='Guardian'>Guardian</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Child">Child</option>
                <option value="Aunt/Uncle">Aunt/Uncle</option>
                <option value="Cousin">Cousin</option>
                <option value="Friend">Friend</option>
                <option value="Partner">Partner</option>
                <option value="Step-Parent">Step-Parent</option>
                <option value="Step-Sibling">Step-Sibling</option>
                <option value="Foster Parent">Foster Parent</option>
                <option value="Neighbor">Neighbor</option>
                <option value="Colleague">Colleague</option>
                <option value="Other">Other</option>
              </select>

              <label>Emergency Phone Number:</label>
              <input type='number' value={emerPhone} onChange={(e) => setEmerPhone(e.target.value)} />

            <button className='test-form-btn' type="submit" disabled={isDisabled}>Submit</button>

          </form>

          <ToastContainer />

        </div>

      </section>
    </>
  );


}

export default TestForm


