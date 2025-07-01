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
import { useState, useEffect, useRef } from 'react'
import useAuth from '../../hooks/useAuth'

const Welcome = () => {

    const [isVisible, setIsVisible] = useState(false)

    const {dark} = useAuth()

    const scrollRef = useRef()

    useEffect(() => {
        const handleScroll = () => {
            const show = window.scrollY > 500
            setIsVisible(show)
            if(scrollRef.current){
                if(isVisible){
                    scrollRef.current.classList.add('scrolltop')
                }else{
                    scrollRef.current.classList.remove('scrolltop')
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [isVisible])

    const handlescrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const content = (
        
        <section className="welcome">

            <div className='welcome-space'>
                
                <div className='welcome-img' style={{backgroundColor: dark ? '#121212' : 'black'}}>
                    <p style={{cursor: 'default'}}>NEXCARE <sup>Innovate</sup></p><br />
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
                 
                        <h4 style={{color: dark ? '#EAEAEA' : 'gray'}}>Instant Confirmation</h4>
                        <p style={{color: dark ? '#BBBBBB' : 'gray', cursor: 'default'}}>
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
                        <p style={{cursor: 'default'}}>World class technology!</p>
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
                    <p style={{color: dark ? 'silver' : 'black'}}>The Medical Team</p>
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
                    <p style={{color: dark ? 'white' : 'black'}}>Patients receive instant confirmations and reminders, minimizing missed appointments.</p>
                    <div className='testcenter-container' style={{color: dark ? 'white' : 'black'}}>
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
                    <p style={{color: dark ? 'white' : 'black'}}>making healthcare more accessible and efficient at Nexcare Testing Center.</p>
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
                    <p style={{color: dark ? 'silver' : '#363535', cursor: 'default'}}>Our service is designed to be convenient, accurate, and confidential, ensuring that your health information is secure and accessible only to you. NexCare is committed to providing exceptional customer service and support throughout the entire process. Whether you need a routine check-up or specific health screenings, we are here to help you every step of the way.</p>
                </div>

                <div className="welcome-content">
                    <h1 style={{color: dark ? 'white' : 'black'}}>Your health<br />
                    <span>our priority.</span></h1>
                    <img src={healthcareblue} alt="Healthcare" />
                </div>

                <div className='foot-info'>

                    <p style={{cursor: 'default'}}>For support or inquiries</p>
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

                {isVisible && (
                <span
                    ref={scrollRef}
                    onClick={handlescrollToTop}
                >
                ↑
                </span>
            )}

            </div>

        </section>
    )

    return content
}
export default Welcome
