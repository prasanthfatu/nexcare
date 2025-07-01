import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import UsersList from "./UsersList";
import useAuth from "../../hooks/useAuth";

const Users = () => {
    const {dark} = useAuth()
    const [users, setUsers] = useState([]);
    const navigate = useNavigate()
    const location = useLocation()
    const axiosPrivate = useAxiosPrivate()

useEffect(() => {
    const controller = new AbortController();

    const getUsers = async () => {

        try {
            const response = await axiosPrivate.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    getUsers();

    return () => {
        controller.abort();
    }
}, [axiosPrivate, location, navigate])

const content = (
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
)


if(!users || users.length === 0) {
    return <p style={{color: dark ? '#EAEAEA' : 'black'}}>Loading...</p>
}

return content;

};


export default Users;
