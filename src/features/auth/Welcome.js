import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'
import doctorvisit from '../../img/doctor-visit.png'
import healthcare from '../../img/health-care.png'
import patientedit from '../../img/patient-edit.jpg'
import professionalteam from '../../img/Health professional team.png'
import healthcareblue from '../../img/healthcare-blue.png'
import healthcareblue2 from '../../img/healthcare-blue2.png'
import img1 from '../../img/protect.jpg'
import img2 from '../../img/protect2.jpg'
import img3 from '../../img/protect3.jpg'
import img4 from '../../img/protect4.jpg'
import support from '../../img/support.png'
import healthtest from '../../img/health-test.png'
import healthsupport from '../../img/health-support.png'
import healthdigital from '../../img/health-digital.png'
import { useState, useEffect, useRef, useCallback } from 'react'
import useAuth from '../../hooks/useAuth'
import AIassistant from '../../components/AIassistant'

const Welcome = () => {

    const [isVisible, setIsVisible] = useState(false)
    const [aiOpen, setAiOpen] = useState(false)
    const [footSlideIndex, setFootSlideIndex] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0)

    const {dark} = useAuth()

    const scrollRef = useRef()
    const slideRef = useRef(null)
    const year = new Date().getFullYear()
    const imageSlide = [healthcareblue, healthcareblue2]
    const images = [img1, img2, img3, img4]

    const goNext = useCallback(() => {
        const isLast = footSlideIndex === imageSlide.length - 1
        const result = isLast ? 0 : footSlideIndex + 1
        setFootSlideIndex(result)
    }, [footSlideIndex, imageSlide.length])

    const resetCurrrentIndex = () => {
            if(slideRef.current){
                clearTimeout(slideRef.current)
            }
    }

    useEffect(() => {
            if(images.length === 0) return
            resetCurrrentIndex()
            slideRef.current = setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % images.length)
            }, 3000)
            return () => resetCurrrentIndex()
    }, [currentIndex, images.length])
    
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

    useEffect(() => {
        if(imageSlide.length === 0) return
        const id = setTimeout(() => {
            goNext()
        }, 5000)
        return () => clearTimeout(id)
    }, [goNext, imageSlide.length])

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
                            <div className='img-design'><img src={support} alt='healthcare' loading='lazy' /></div>
                            <div className='img-design'><img src={doctorvisit} alt='healthcare' loading='lazy' /></div>
                            <div className='img-design'><img src={healthtest} alt='healthcare' loading='lazy' /></div>
                        </div>

                    </div>

                    <div className='medical-info'>
                        <img src={healthcare} alt='healthcare' loading='lazy' />
                    </div>

                </div>

                <div className='dot-linetwo'>
                    <div className='dot-linetwo-img'>
                        <img src={patientedit} alt='healthcare' loading='lazy' />
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
                    <img src={professionalteam} alt='healthcare' loading='lazy' />
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
                    <img className='health-digital' src={healthdigital} alt='healthcare' loading='lazy' />
                    <img className='health-support' src={healthsupport} alt='healthcare' loading='lazy' />
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

                <div style={{width: '100%', height: '600px', position: 'relative', overflow: 'hidden'}}>
                    <div 
                        
                        style={{width: '100%', height: '600px', whiteSpace: 'nowrap', transform: `translateX(-${currentIndex * 100}%)`,transition: 'transform 0.7s ease'}}>
                        {
                            images.map((src, i) => (
                                <img 
                                    key={i}
                                    src={src}
                                    alt={`slide-${i}`}
                                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                />
                            ))
                        }
                    </div>

                    <div style={{position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px'}}>
                        {
                            images.map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setCurrentIndex(i)}
                                    style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor: currentIndex === i ? '#0D0D0D' : 'white', border: '1px solid black'}}
                                />
                            ))
                        }
                    </div>
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

                <div className="welcome-content" style={{border: dark ? "0.01px solid #333333" : '0.01px solid #ccc', marginTop: '10px'}}>
                    <h1 style={{color: dark ? 'white' : 'black'}}>Your health<br />
                    <span>our priority.</span></h1>
                    <img src={`${imageSlide[footSlideIndex]}`} alt="Healthcare" loading='lazy' style={{transition: 'all 0.3s ease'}} />
                </div>

                <div className='foot-info' style={{border: dark ? "0.01px solid #333333" : '0.01px solid #ccc', marginTop: '10px'}}>

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

                <footer
                    style={{
                    backgroundColor: dark ? 'black' : 'aliceblue',
                    color: dark ? 'silver' : '#272525',         
                    textAlign: "center",
                    padding: "15px",
                    fontSize: "13px",
                    fontFamily: "Arial, sans-serif",
                    whiteSpace: 'nowrap',
                    marginBottom: '25px'
                    }}
                >
                    &copy; {year} Nexcare Innovate. All rights reserved.
                </footer>

                {isVisible && (
                <span
                    ref={scrollRef}
                    onClick={handlescrollToTop}
                >
                ↑
                </span>
                )}

                {aiOpen && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            zIndex: 1000,
                        }}
                    >
                        <div
                            className="ai-modal"
                            style={{
                                position: "relative",
                                backgroundColor: dark ? "#1e1e1e" : "#fff",
                                padding: "20px",
                                borderRadius: "12px",
                                height: "80%",
                                width: "90%",
                                maxWidth: "500px",
                                display: "flex",
                                flexDirection: "column",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                            }}
                            >
                            {/* Close Button */}
                            <button
                                onClick={() => setAiOpen(false)}
                                style={{
                                position: "absolute",
                                top: "10px",
                                right: "15px",
                                background: "transparent",
                                border: "none",
                                fontSize: "20px",
                                fontWeight: "bold",
                                color: dark ? "white" : "black",
                                cursor: "pointer",
                                }}
                            >
                                ✖
                            </button>
    
                            {/* Chat Title */}
                            <h3
                                style={{
                                textAlign: "center",
                                marginBottom: "10px",
                                color: dark ? "white" : "#333",
                                }}
                            >
                                Nexcare Assistant 🤖
                            </h3>
    
                            {/* AI Chat Component */}
                            <div style={{ flex: 1, overflow: "hidden" }}>
                                <AIassistant />
                            </div>
                        </div>
                    </div>
                                  
                )}
                
                {!aiOpen && (
                    <button
                        onClick={() => setAiOpen(true)}
                        style={{
                        position: "fixed",
                        bottom: "40px",
                        right: "40px",
                        backgroundColor: dark ? "#2d3748" : "#2563eb", // Dark gray (dark mode) / Blue-600 (light mode)
                        color: "white",
                        padding: "12px 20px",
                        border: "none",
                        borderRadius: "30px",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "16px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        transition: "all 0.3s ease-in-out",
                        }}
                        onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = dark ? "#4a5568" : "#1d4ed8")
                        }
                        onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = dark ? "#2d3748" : "#2563eb")
                        }
                    >
                        Ask Nexcare 💬
                    </button>
                )}
                

            </div>

        </section>
    )

    return content
}
export default Welcome
