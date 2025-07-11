import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import useAuth from "../hooks/useAuth"

const Visit = () => {

    const {dark} = useAuth()

    return (

        <div style={{position: 'relative'}}>

            <div
                style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, width: '100dvw', height: '100dvh', zIndex: -1}}
            />

            <div className="visit-link">
                <Link to='/'><FontAwesomeIcon icon={faArrowLeft} style={{color: dark ? "black" : 'whitesmoke'}} /></Link>
            </div>

            <section className="choose" style={{backgroundColor: dark ? '#121212' : 'whitesmoke'}}>

                <div className="choose-container">

                    <h1>Visit Us Today</h1>

                    <p>Experience excellence in medical testing at Nexcare Innovate. Whether you're due for routine screenings or require specialized diagnostic services, we're here to meet your healthcare needs with professionalism and care. Schedule your appointment today and take the first step towards better health.</p>

                    <div className="visit-border">
                        <h5>How to Schedule an Appointment</h5>

                        <p>Booking an appointment at Nexcare Innovate is quick and easy. Simply contact our friendly staff via phone or email, or use our online appointment scheduling portal to select a convenient date and time for your visit.</p>
                    </div>

                    <address style={{color: 'gray'}}>
                        123 Main Street<br />
                        Cityville<br />
                        State 12345<br />
                        Testland<br />
                        Phone Number: 0987654321<br />
                        Email: nexcareinnovate@xyz.com
                    </address>

                </div>

            </section>
        </div>

    )
    
}

export default Visit
