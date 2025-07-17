import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import UsersList from "./UsersList";
import useAuth from "../../hooks/useAuth";

const Users = () => {

    const errRef = useRef(null)
    const {dark} = useAuth()
    const [users, setUsers] = useState([]);

    const navigate = useNavigate()
    const location = useLocation()
    const axiosPrivate = useAxiosPrivate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);

    const getUsers = useCallback(async () => {
        
        try {
            setLoading(true)
            setError(null)
            const response = await axiosPrivate.get('/users');
            setUsers(response.data);
        } catch (err){
            console.error(err);
            if (!err.response) {
                setError('Server Unreachable');
            } else if (err.response.status === 400) {
                setError(err.response.data.message);
            } else if (err.response.status === 401) {
                // Redirect only on 401 Unauthorized
                navigate('/login', { state: { from: location }, replace: true });
                return;
            } else {
                setError(err.response?.data?.message || 'Error getting users details');
            }
        } finally {
            setLoading(false)
        }

    }, [axiosPrivate, location, navigate])

     
    useEffect(() => {
        getUsers()
    }, [getUsers])

    const errClass = error ? "errmsg" : "offscreen"

    if (loading) {
        return (
            <div style={{ color: dark ? '#EAEAEA' : 'black', textAlign: 'center', marginTop: '2rem' }}>
                Loading users...
            </div>
        );
    }

    if (error) {
            return (
                <section style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0'}}>

                    <p ref={errRef} className={errClass} aria-live="assertive" style={{cursor: 'default'}}>{error}</p>

                    <p style={{color: dark ? 'gray' : 'black', margin: '0.25rem 0 1rem', cursor: 'default'}}>Could not retrieve information</p>

                    <button onClick={getUsers} style={{cursor: 'pointer', fontSize: '12px', padding: '0.25rem 0.5rem', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', fontWeight: 'bold'}}>Retry</button>

                </section>
            
            )
        }

    const content = (
        <>
        <h3 style={{color: dark ? '#EAEAEA' : 'black', textAlign: 'center', marginBottom: '12px'}}>Users</h3>
        <table className="user-table">
            <thead>
                <tr>
                    <th style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}}>Username</th>
                    <th style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}}>Roles</th>
                    <th style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}}>Edit</th>
                </tr>
            </thead>
            <tbody>
                <UsersList users={users} />
            </tbody>
        </table>
        </>
    )

    return !loading && users.length > 0 ? content : <p style={{ color: dark ? '#EAEAEA' : 'black' }}>No users found.</p>;
};


export default Users;
