import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faFloppyDisk, faTrash} from '@fortawesome/free-solid-svg-icons'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useNavigate } from 'react-router-dom'

const USER_REGEX = /^[A-z]{3,20}$/;

const EditUserPage = ({singleUser, userId}) => {

    const errRef = useRef()
    const axiosPrivate = useAxiosPrivate()
    const navigate = useNavigate()

    const [user, setUser] = useState(singleUser?.username)
    const [validUser, setValidUser] = useState(false)
    const [roles, setRoles] = useState(singleUser?.roles)
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        setValidUser(USER_REGEX.test(user))
    }, [user])

    useEffect(() => {
        setErrMsg('')
    }, [user])

    const saveUser = async() => {
         // if button enabled with JS hack
         const v1 = USER_REGEX.test(user);
         if (!v1) {
             setErrMsg("Invalid Entry");
             return;
         }
        try {
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
        }

    }

    const deleteUser = async() => {
        try {
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
        }
    }

  return (
    <section className="public">

        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

        <h1>Update User</h1>

        <form className='form'> 

            <label className="form__label" htmlFor="username">
                Username: <span className="nowrap">[3-20 letters]</span></label>
            <input
                id="username"
                name="username"
                type="text"
                autoComplete="off"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
            />
                        
            <label htmlFor='role'>Role:</label>
            <select name='role' value={roles} onChange={(e) => setRoles(Array.from(e.target.selectedOptions, option => option.value))} multiple>
                <option value='Admin'>Admin</option>
                <option value='HealthcareProvider'>HealthcareProvider</option>
                <option value='User'>User</option>
            </select>

            <button type="button" disabled={!validUser} onClick={saveUser}><FontAwesomeIcon icon={faFloppyDisk} /></button>
            <button type="button" onClick={deleteUser}><FontAwesomeIcon icon={faTrash} /></button>

        </form>

    </section>
  )
}

export default EditUserPage
