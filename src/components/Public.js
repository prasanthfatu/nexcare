import { Link, useNavigate } from 'react-router-dom'
import doc from "../img/doc.jpg"
import test from '../img/test.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faRightToBracket, faUserPlus, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import Page from './Page'

const Public = () => {

    const navigate = useNavigate()

    const docRef = useRef()

    const [openbar, setOpenbar] = useState(false)

    useEffect(() => {
        let handle = (e) => {
            if (!docRef.current.contains(e.target)) {
                setOpenbar(false)
            }
        }
        document.addEventListener('mousedown', handle)

        return () => {
            document.removeEventListener('mousedown', handle)
        }
    })

    const content = (

        <section className="public">

            <header className='loginheader'>

                <div className="nav-menu">

                    <div className='nav-login'>
                        <Link to="/login" className='loginpad'><FontAwesomeIcon icon={faRightToBracket} /></Link>
                        <span className="hover-text">Sign in</span>
                    </div>

                    <div className="nav-login">
                        <Link to="/register" className='loginpad'><FontAwesomeIcon icon={faUserPlus} /></Link>
                        <span className="hover-text">Sign up</span>
                    </div>

                    <div className="nav-login">
                        <Link to="/about" className='info'><FontAwesomeIcon icon={faCircleInfo} /></Link>
                        <span className="hover-text">About</span>
                    </div>

                </div>

                <div ref={docRef}>

                    <div className='nav-sidebar' onClick={() => setOpenbar(!openbar)}>
                        <FontAwesomeIcon icon={faBars} />
                    </div>

                    <div className={`dropdown-menu ${openbar ? 'active' : 'inactive'}`}>
                        <ul>
                            <div className='bar-list' onClick={() => navigate('/login')}><li className='baricon'><FontAwesomeIcon icon={faRightToBracket} /></li><p className='signup'>Sign in</p></div>
                            <div className='bar-list' onClick={() => navigate('/register')}><li className='baricon'><FontAwesomeIcon icon={faUserPlus} /></li><p>Sign up</p></div>
                            <div className='bar-list' onClick={() => navigate('/about')}><li className='baricon'><FontAwesomeIcon icon={faCircleInfo} /></li><p className='signup'>About</p></div>
                        </ul>
                    </div>

                </div>

            </header>

            <main className="public__main">

                <div className='first-box'>

                    <h1><span className='nowrap'>Nexcare Innovate</span></h1>
                    <br />

                    <p className='main-para'>
                        Our experienced and certified medical professionals are dedicated to ensuring the highest standards of accuracy in every test.
                    </p>

                    <div className='doc-card'>
                        <div className="gallery">
                            <img className="doc-img" src={doc} alt='Healthcare' />
                            <p>Book your appointment</p>
                        </div>
                    </div>

                </div>
                <br />

                <button className='learn-btn' onClick={() => navigate('/health-care')}>Learn more</button>
                <br />

                <div className='second-box'>
                   
                    <p>
                        <span className='para-span'>Best Medical Test. For Everyone.</span><br />
                        <br />
                        These tests encompass a broad spectrum, ranging from routine blood tests to sophisticated imaging procedures such as MRIs and CT scans. With advancements in technology and research, medical tests play an integral role in providing accurate diagnoses, guiding treatment decisions, and promoting overall wellness and quality of life for patients.<br />
                        <br />
                        <span className='link-para'><a href='#third-box'>Learn more</a></span>

                    </p>

                    <img className="doc-img" src={test} alt='Healthcare' />

                </div>
                <br />

                <p className='para'>Test with Nexcare Innovate</p>

                <p className='para-public'>
                    Medical tests are essential for diagnosing and monitoring health conditions, ranging from routine blood tests to advanced imaging techniques. They play a vital role in guiding treatment decisions and promoting overall well-being.
                </p>

                <button className='learn-btn' onClick={() => navigate('/visit-our-medicalcenter')}>Visit our Medical test center</button>

                <div id="third-box">
                    <Page />
                </div>

            </main>

            <footer className='public-foot'>
                <p className='foot'>© NexCare Innovate Medical Center 2024. All rights reserved.</p>
            </footer>

        </section>

    )

    return content

}

export default Public