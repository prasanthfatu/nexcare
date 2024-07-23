import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const Visit = () => {

    return (

        <>
            <div className="visit-link">
                <Link to='/'><FontAwesomeIcon icon={faArrowLeft} /></Link>
            </div>

            <section className="visit">

                <div className="visit-container">

                    <h1>Visit Us Today</h1>

                    <p>Experience excellence in medical testing at Nexcare Innovate. Whether you're due for routine screenings or require specialized diagnostic services, we're here to meet your healthcare needs with professionalism and care. Schedule your appointment today and take the first step towards better health.</p>

                    <div className="visit-border">
                        <h5>How to Schedule an Appointment</h5>

                        <p>Booking an appointment at Nexcare Innovate is quick and easy. Simply contact our friendly staff via phone or email, or use our online appointment scheduling portal to select a convenient date and time for your visit.</p>
                    </div>

                    <address>
                        123 Main Street<br />
                        Cityville<br />
                        State 12345<br />
                        Testland<br />
                        Phone Number: 0987654321<br />
                        Email: nexcareinnovate@xyz.com
                    </address>

                </div>

            </section>
        </>

    )
    
}

export default Visit
