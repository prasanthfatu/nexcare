import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <section className='about'>
        <Link to='/account'><FontAwesomeIcon icon={faArrowLeft} /></Link>
        <p>Unauthorized</p>
    </section>
  )
}

export default Unauthorized
