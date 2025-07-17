import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faFloppyDisk, faTrash, faXmark} from '@fortawesome/free-solid-svg-icons'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const USER_REGEX = /^[A-z]{3,20}$/;

const EditUserPage = ({singleUser, userId}) => {

    const {dark} = useAuth()

    const errRef = useRef()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    const [confirmDelete, setConfirmDelete] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const [user, setUser] = useState(singleUser?.username)
    const [validUser, setValidUser] = useState(false)
    const [roles, setRoles] = useState(singleUser?.roles)
    const [errMsg, setErrMsg] = useState('')

    const [isFocused, setIsFocused] = useState({
        focusUser: false,
        focusRoles: false
    })

    useEffect(() => {
        setValidUser(USER_REGEX.test(user))
    }, [user])

    useEffect(() => {
        setErrMsg('')
    }, [user])

    const saveUser = async() => {
         // if button enabled with JS hack
         const v1 = USER_REGEX.test(user);
         if (!v1 || !validUser) {
             setErrMsg("Invalid Entry");
             return;
         }
        try {
          setLoading(true)
            await axiosPrivate.put(`/users`, 
                JSON.stringify({userId, username: user, roles})
            )
            setUser('')
            navigate(`/account/users`)
        } catch (err) {
            console.error(err);
           console.error(err.message);
           if(!err.response){
            setErrMsg('Server Unreachable')
           }else if(err.response.status === 409){
            setErrMsg('Duplicate Username')
           }else{
            setErrMsg('Error Updating User')
           }
           errRef.current.focus()
        } finally{
          setLoading(false)
        }

    }

    const deleteUser = async() => {
      setConfirmDelete(false)
        try {
          setLoading(true)
            await axiosPrivate.delete(`/users/${userId}`)
            navigate(`/account/users`)
        } catch (err) {
            console.error(err.message);
            if(!err.response){
                setErrMsg('Server Unreachable')
            }else if(err.response.status === 400){
                setErrMsg('Bad Request')
            }else{
                setErrMsg('Error Deleting User')
            }   
            errRef.current.focus()         
        } finally{
          setLoading(false)
        }
    }

    const styles = {
    darklabel: {
      color: 'gray', position: 'absolute', transform: 'translate(0, -50%)', backgroundColor: '#0D0D0D', zIndex: 1, transition: 'top 0.3s linear', padding: '2px 5px', marginLeft: '1.5px'
    },
    lightlabel: {
      color: 'gray', position: 'absolute', transform: 'translate(0, -50%)', backgroundColor: '#fff', zIndex: 1, transition: 'top 0.3s linear', padding: '2px 5px', marginLeft: '1.5px'
    },
     overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '400px',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    border: 'none',
    background: 'transparent',
    fontSize: '18px',
    cursor: 'pointer',
  },
  }  

    const handleFocus = (field) => {
        setIsFocused(prev => ({
            ...prev, [field]: true
        }))
    }

    const handleBlur = (field) => {
        setIsFocused(prev => ({
            ...prev, [field]: false
        }))
    }

  return (
    <section className="public dash-outlet">
        <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

        <h1 style={{color: dark ? '#EAEAEA' : 'black', marginBottom: '10px'}}>Update User</h1>

        <form className='form'> 

             {/* Name */}
           <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>

            <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusUser || user !== '') ? '20px' : '48px', left: (isFocused.focusUser || user !== '') ? '30px' : '30px', fontSize: (isFocused.focusUser || user !== '') ? '13px' : '16px'}}>
              Patient Name
            </label>

            <input 
                style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                onFocus={() => handleFocus('focusName')}
                onBlur={() => handleBlur('focusName')}
              type="text" name="username" autoComplete='off' value={user} onChange={(e) => setUser(e.target.value)} required />

          </div>

            {/* Role */}
                <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: 'auto', height: '200px'}}>
  
                  <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusRoles || roles !== '') ? '20px' : '48px', left: (isFocused.focusRoles || roles !== '') ? '30px' : '30px', fontSize: (isFocused.focusRoles || roles !== '') ? '13px' : '16px'}}>Role</label>
  
                  <select 
                    style={{backgroundColor: dark ? '#0D0D0D' : 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                    onFocus={() => handleFocus('focusRoles')}
                    onBlur={() => handleBlur('focusRoles')} 
                    value={roles} 
                    onChange={(e) => setRoles(Array.from(e.target.selectedOptions, option => option.value))}
                    multiple
                  >
                    <option value='Admin'>Admin</option>
                    <option value='HealthcareProvider'>HealthcareProvider</option>
                    <option value='User'>User</option>
                  </select>
  
                </div> 

                <div className="btn-container" style={{marginTop: '17px'}}>
                    <button className="patient-save-btn" type="button" onClick={saveUser} style={{backgroundColor: 'transparent'}}><FontAwesomeIcon icon={faFloppyDisk} style={{color: dark ? '#EAEAEA' : 'black'}} /></button>
                    <button 
                    style={{backgroundColor: 'transparent'}}
                    className="patient-delete-btn" type="button" onClick={() =>setConfirmDelete(true)}><FontAwesomeIcon icon={faTrash} style={{color: 'red'}} /></button>
                </div>

        </form>

        <div>
        {
              confirmDelete && (
                  <div style={styles.overlay}>  

                    <div style={styles.modal}>

                      <div onClick={() => setConfirmDelete(false)} style={styles.closeBtn}>
                        <FontAwesomeIcon icon={faXmark} />
                      </div>

                      <p style={{ color: '#333333', fontSize: '15px', cursor: 'default', padding: '10px', textAlign: 'center'}}>Do you want to delete?</p> 

                      <div className="confirm-delete-btn">

                        <button type='button' onClick={() => setConfirmDelete(false)} style={{backgroundColor: '#007bff', color: 'white', fontSize: '12px', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>cancel</button>

                        <button type='button' onClick={deleteUser} style={{backgroundColor: 'firebrick', color: 'white', fontSize: '12px', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}>delete</button>

                      </div>

                    </div>

                </div>  
              )
          }
        </div>

    </section>
  )
}

export default EditUserPage
