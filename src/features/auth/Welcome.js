import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import doctorvisit from '../../img/doctor-visit.png'
import healthcare from '../../img/health-care.png'
import patientedit from '../../img/patient-edit.jpg'
import professionalteam from '../../img/Health professional team.png'
import healthcareblue from '../../img/healthcare-blue.png'
import support from '../../img/support.png'
import healthtest from '../../img/health-test.png'
import healthsupport from '../../img/health-support.png'
import healthdigital from '../../img/health-digital.png'

const Welcome = () => {

    const content = (
        
        <section className="welcome">

            <div className='welcome-space'>
                
                <div className='welcome-img'>
                    <p>NEXCARE <sup>Innovate</sup></p><br />
                    <h6 className='welcome-para'>Our friendly and professional staff are ready to<br /> assist you, ensuring your experience is as smooth<br /> and stress-free as possible.</h6>
                </div>

                <div className='dot-line'>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                </div>

                <div className='medical-info-container'>

                    <div className='medical-img'>
                 
                        <h4>Instant Confirmation</h4>
                        <p>
                            Nexcare Testing Center simplifies the scheduling process, allowing patients to select convenient time slots from their devices. This system reduces wait times and eliminates the need for phone calls or in-person visits to schedule tests.
                        </p>
                        <div className='img-container'>
                            <div className='img-design'><img src={support} alt='healthcare' /></div>
                            <div className='img-design'><img src={doctorvisit} alt='healthcare' /></div>
                            <div className='img-design'><img src={healthtest} alt='healthcare' /></div>
                        </div>

                    </div>

                    <div className='medical-info'>
                        <img src={healthcare} alt='healthcare' />
                    </div>

                </div>

                <div className='dot-linetwo'>
                    <div className='dot-linetwo-img'>
                        <img src={patientedit} alt='healthcare' />
                        <p>World class technology!</p>
                    </div>
                    <div className='dot-linetwo-container'>
                        <p>|</p>
                        <p>|</p>
                        <p>|</p>
                        <p>|</p>
                        <p>|</p>
                        <p>|</p>
                        <p>|</p>
                        <p>|</p>
                    </div>
                </div>

                <div className='test-info'>
                    <p>The Medical Team</p>
                </div>

                <div className='welcome-test-img'>
                    <img src={professionalteam} alt='healthcare' />
                </div>

                <div className='dot-line'>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                </div>

                <div className='testcenter-info'>
                    <img className='health-digital' src={healthdigital} alt='healthcare' />
                    <img className='health-support' src={healthsupport} alt='healthcare' />
                    <p>Patients receive instant confirmations and reminders, minimizing missed appointments.</p>
                    <div className='testcenter-container'>
                        <div className='testcenter-para'>
                            <p>Overall</p>
                            <p>online</p>
                            <p>booking</p>
                            <p>enhances</p>
                            <p>patient satisfaction</p>
                            <p>improves</p>
                            <p>time</p>
                            <p>management</p>
                            <p>for</p> 
                            <p>medical staff</p>
                        </div>
                    </div>
                    <p>making healthcare more accessible and efficient at Nexcare Testing Center.</p>
                </div>

                <div className='dot-line'>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                    <p>|</p>
                </div>

                <div className='test-info-more'>
                    <p>Our service is designed to be convenient, accurate, and confidential, ensuring that your health information is secure and accessible only to you. NexCare is committed to providing exceptional customer service and support throughout the entire process. Whether you need a routine check-up or specific health screenings, we are here to help you every step of the way.</p>
                </div>

                <div className="welcome-content">
                    <h1>Your health<br />
                    <span>our priority.</span></h1>
                    <img src={healthcareblue} alt="Healthcare" />
                </div>

                <div className='foot-info'>

                    <p>For support or inquiries</p>
                    <div className='foot-info-style'>
                        <div className='foot-info-container'>
                            <FontAwesomeIcon icon={faEnvelope} />
                            <p>support@nexcarexyz.com</p>
                        </div>
                        <div className='foot-info-container'>
                            <FontAwesomeIcon icon={faPhone} />
                            <p>(123) 456-7890</p>
                        </div>                
                    </div>
                    
                </div>

            </div>

        </section>
    )

    return content
}
export default Welcome