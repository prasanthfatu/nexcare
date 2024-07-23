import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import EditUserPage from "./EditUserPage"

const EditUser = () => {

    const {userId} = useParams()
    const axiosPrivate = useAxiosPrivate()
    const [singleUser, setSingleUser] = useState([])

    useEffect(()=> {
        const fetchUser = async() => {
            try {
               const response = await axiosPrivate.get(`/users/${userId}`)  
               setSingleUser(response.data)
            } catch (err) {
               console.error(err); 
            }
        }
        fetchUser()
    }, [axiosPrivate, userId])

    const content = singleUser && <EditUserPage key={singleUser._id} singleUser={singleUser} userId={userId} />

  return (
        <>
            {content}
        </>
  )
}

export default EditUser
