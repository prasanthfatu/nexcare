import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import useAuth from '../../hooks/useAuth'

const RegSuccess = () => {

    const {dark} = useAuth()
  
    return (
        <section style={{backgroundColor: dark ? '#0D0D0D' : '#fff', width:'100vw', height: '100dvh', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem'}}>

            <div><Link to='/'><FontAwesomeIcon icon={faArrowLeft} style={{color: dark ? '#EAEAEA' : '#272525'}} /></Link></div>

            <h4 style={{color: 'white', padding: '5px 10px', borderRadius: '5px', backgroundColor: 'rgba(5, 135, 94, 0.75)', fontFamily: 'monospace', fontSize: '14px'}}>Registration successful!</h4>

            <p style={{color: dark ? '#777777' : 'gray', cursor: 'default', margin: 0}}>Welcome to NexCare Innovate. Your account is now active and ready to access our comprehensive medical testing services.</p>

          <p style={{color: dark ? '#777777' : 'gray', cursor: 'default', margin: 0}}>Thank you for joining us!</p>

          <p style={{margin: 0, width: 'fit-content', padding: '0 5px'}}>
            <span className="line">
                <a href="/login" style={{color: dark ? '#EAEAEA' : 'black', cursor: 'pointer', fontFamily: 'monospace'}}>Sign In</a>
            </span>
          </p>

        </section>
      )
}

export default RegSuccess
