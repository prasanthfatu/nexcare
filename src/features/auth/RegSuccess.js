import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"

const RegSuccess = () => {
  
    return (
        <section className='about regsuccess'>
          <Link to='/'><FontAwesomeIcon icon={faArrowLeft} /></Link>
          <h4>Registration successful!</h4>
          <p>Welcome to NexCare Innovate. Your account is now active and ready to access our comprehensive medical testing services.</p>
         <p>Thank you for joining us!</p>
         <p>
        <span className="line">
            <a href="/login">Sign In</a>
        </span>
        </p>
        </section>
      )
}

export default RegSuccess
