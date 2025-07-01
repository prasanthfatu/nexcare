import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Unauthorized = () => {
  const {dark} = useAuth()
  return (
    <section className='about' style={{color: dark ? '#EAEAEA' : 'black'}}>
        <Link to='/account'><FontAwesomeIcon icon={faArrowLeft} style={{color: dark ? '#EAEAEA' : 'black'}} /></Link>
        <p style={{cursor: 'default'}}>Unauthorized</p>
    </section>
  )
}

export default Unauthorized
