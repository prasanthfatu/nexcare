import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare} from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"

const SingleUserPage = () => {

    const {dark} = useAuth()
    const {userId} = useParams()

    const axiosPrivate = useAxiosPrivate()

    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const getUser = async() => {
            setLoading(true)
            try {
                const response = await axiosPrivate.get(`/users/${userId}`)
                setUser(response.data)
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false)
            }
        }
        getUser()
    }, [axiosPrivate, userId])

    if(loading) {
        return(
            <>
                <p style={{color: dark ? '#EAEAEA' : 'black'}}>Loading...</p>
                <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>
            </>
        )
    }

    if(!user){
        return (
            <section>
                <p className="patients-list-para">user not found!</p>
            </section>
        )
    }        

  return (
    <>
        <section>
            <h3 style={{color: dark ? '#EAEAEA' : 'black'}}>User Details</h3>
            <p style={{color: dark ? '#BBBBBB' : 'black', cursor:'default'}}>Name: {user.username}</p>
            <p style={{color: dark ? '#BBBBBB' : 'black', cursor: 'default'}}>Role: {user.roles}</p>
            <Link to={`/account/users/edit/${user._id}`}><FontAwesomeIcon icon={faPenToSquare} style={{color: dark ? '#EAEAEA' : 'black'}} /></Link>
        </section>
    </>    
  )
}

export default SingleUserPage
