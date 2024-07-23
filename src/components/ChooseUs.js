import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const ChooseUs = () => {

    return (

        <>
            <div className="visit-link">
                <Link to='/'><FontAwesomeIcon icon={faArrowLeft} /></Link>
            </div>

            <section className="choose">

                <div className="choose-container">

                    <h1>Why Choose Us?</h1>

                    <h5>Accuracy and Reliability</h5>
                    <p>We utilize advanced technology and adhere to strict quality control measures to ensure accurate and reliable test results.</p>

                    <h5>Compassionate Care</h5>
                    <p>Our team of dedicated medical professionals provides compassionate care and support throughout the testing process.</p>

                    <h5>Convenience</h5>
                    <p>With convenient locations, flexible scheduling options, and efficient service delivery, we strive to make the testing experience as convenient as possible for our patients.</p>

                    <h5>Confidentiality</h5>
                    <p>We prioritize patient privacy and confidentiality, maintaining strict adherence to HIPAA regulations and ethical standards.</p>

                    <h5>Continued Innovation</h5>
                    <p>We are committed to staying at the forefront of medical advancements, continuously updating our technology and expanding our test offerings to meet evolving healthcare needs.</p>
                
                </div>

            </section>

        </>
    )
}

export default ChooseUs
