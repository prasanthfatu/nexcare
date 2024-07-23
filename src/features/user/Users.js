import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import UsersList from "./UsersList";

const Users = () => {
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
                <th>Username</th>
                <th>Roles</th>
                <th>Edit</th>
            </tr>
        </thead>
        <tbody>
            <UsersList users={users} />
        </tbody>
    </table>
)


if(!users || users.length === 0) {
    return <p>Loading...</p>
}

return content;

};


export default Users;
