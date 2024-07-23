import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare} from "@fortawesome/free-solid-svg-icons"

const SingleUserPage = () => {

    const {userId} = useParams()

    const axiosPrivate = useAxiosPrivate()

    const [user, setUser] = useState([])

    useEffect(() => {
        const getUser = async() => {
            try {
                const response = await axiosPrivate.get(`/users/${userId}`)
                setUser(response.data)
            } catch (err) {
                console.error(err.message);
            }
        }
        getUser()
    }, [axiosPrivate, userId])

    if(!user){
        return (
            <section>
                <p>user not found!</p>
            </section>
        )
    }        

  return (
    <>
        <section>
            <h3>User Details</h3>
            <p>Name: {user.username}</p>
            <p>Role: {user.roles}</p>
            <Link to={`/account/users/edit/${user._id}`}><FontAwesomeIcon icon={faPenToSquare} /></Link>
        </section>
    </>    
  )
}

export default SingleUserPage
