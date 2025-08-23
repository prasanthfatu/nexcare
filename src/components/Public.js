import { Link, useNavigate } from 'react-router-dom'
import doc from "../img/doc.jpg"
import test from '../img/test.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faRightToBracket, faUserPlus, faCircleInfo, faUser, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import Page from './Page'
import axios from '../app/api/axios'
import useAuth from '../hooks/useAuth'
import AIassistant from './AIassistant'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Public = () => {

    const navigate = useNavigate()

    const docRef = useRef()
    const pageRef = useRef()
    const [aiOpen, setAiOpen] = useState(false)
    
    const [openbar, setOpenbar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)

    const { setAuth, user, dark, setDark } = useAuth()

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

    useEffect(() => {
        localStorage.setItem('darkMode', dark)
    }, [dark])

     const handleGuest = async() => {
        setOpenbar(false)
    
            try {
                setIsDisabled(true)
                setLoading(true)
                const response = await axios.post('/guestauth',
                    JSON.stringify({ user: "Guest User" }),
                    {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    }
                );
                const accessToken = response?.data?.accessToken;
                setAuth({ user, accessToken });
                navigate('/account')
            } catch (err) {
    
                console.error(err)
    
                if (!err?.response) {
                    toast.error('Server Unreachable', {
                        autoClose: 5000,
                        position: "top-center",
                        theme: "light",
                        style: {
                            width: 'auto',
                            height: 'auto',
                            fontSize: "0.8rem"
                        }
                    });
                } else if (err.response?.status === 400) {
                    toast.error('Missing Username or Password', {
                        autoClose: 5000,
                        position: "top-center",
                        theme: "light",
                        style: {
                            width: 'auto',
                            height: 'auto',
                            fontSize: "0.8rem"
                        }
                    });
                } else if (err.response?.status === 401) {
                    toast.error('Unauthorized', {
                        autoClose: 5000,
                        position: "top-center",
                        theme: "light",
                        style: {
                            width: 'auto',
                            height: 'auto',
                            fontSize: "0.8rem"
                        }
                    });
                } else {
                    toast.error('Login Failed', {
                        autoClose: 5000,
                        position: "top-center",
                        theme: "light",
                        style: {
                            width: 'auto',
                            height: 'auto',
                            fontSize: "0.8rem"
                        }
                    });
                }
                setIsDisabled(false)
                setLoading(false)
            }
    }
    const handlePageRef = () => {
        pageRef.current?.scrollIntoView({behavior: 'smooth'})
    }

    const txtColor = dark ? '#EAEAEA' : 'black' 

    const styles = {
        btnStyle: {
            backgroundColor: dark ? '#272525' : 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            border: 'none',
            cursor: 'pointer',
            padding: '12.5px',
            textAlign: 'left',
        },
        iconStyle: {
            width: '15px', height: '15px', color: dark ? '#EAEAEA' : 'black'
        }
    }

    const content = (

        <section className="public"
            style={{backgroundColor: dark ? '#0D0D0D' : 'aliceblue', position: 'relative'}}
        >
            <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>

            <header className='loginheader' style={{backgroundColor: dark ? 'black' : 'aliceblue', borderBottom: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}>
                <div className="nav-menu">

                    <div 
                        className='nav-login'
                        onClick={() => setDark(!dark)}
                        style={{marginRight: '2rem', width: '20px', height: '20px', cursor: 'pointer', color: dark ? '#EAEAEA' : 'black'}}
                    >
                        <FontAwesomeIcon icon={dark ? faSun : faMoon} />
                    </div>
    
                    <div className='nav-login'>
                        <button className='loginpad guest' disabled={isDisabled} onClick={handleGuest} style={{background: dark ? '#EAEAEA' : 'black', color: dark ? 'black' : 'white' }}>Guest User</button>
                    </div>

                    <div className='nav-login'>
                        <Link to="/login" className='loginpad'><FontAwesomeIcon icon={faRightToBracket} style={{color: txtColor}} /></Link>
                        <span className='hover-text' style={{color: txtColor, fontFamily: 'monospace'}}>Sign in</span>
                    </div>

                    <div className="nav-login">
                        <Link to="/register" className='loginpad'><FontAwesomeIcon icon={faUserPlus} style={{color: txtColor}} /></Link>
                        <span className="hover-text" style={{color: txtColor, fontFamily: 'monospace'}}>Sign up</span>
                    </div>

                    <div className="nav-login">
                        <Link to="/about" className='info'><FontAwesomeIcon icon={faCircleInfo} style={{color: txtColor}} /></Link>
                        <span className="hover-text" style={{color: txtColor, fontFamily: 'monospace'}}>About</span>
                    </div>

                </div>

                <div ref={docRef} className='publicnavbar'>

                    <div className='nav-sidebar' onClick={() => setOpenbar(!openbar)}>
                        <FontAwesomeIcon icon={faBars} style={{color: txtColor}} />
                    </div>

                    <div
                    className={`dropdown-menu ${openbar ? 'active' : 'inactive'}`}
                    style={{ backgroundColor: dark ? '#272525' : 'white' }}
                    >
                    <div
                        style={{
                        margin: 0,
                        padding: 0,
                        backgroundColor: dark ? '#272525' : 'white',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        whiteSpace: 'nowrap'
                        }}
                    >
                        <button
                        onClick={() => setDark(!dark)}
                        style={styles.btnStyle}
                        >
                        <span className='baricon'>
                            <FontAwesomeIcon
                            icon={dark ? faSun : faMoon}
                            style={styles.iconStyle}
                            />
                        </span>
                        <p style={{ color: txtColor, marginLeft: '8px' }}>
                            Dark Mode
                            <span
                            style={{
                                color: dark ? 'purple' : 'gray',
                                fontWeight: 'bold',
                                fontSize: '10px',
                                marginLeft: '4px',
                            }}
                            >
                            {dark ? 'on' : 'off'}
                            </span>
                        </p>
                        </button>

                        <button
                        onClick={handleGuest}
                        style={styles.btnStyle}
                        >
                        <span className='baricon'>
                            <FontAwesomeIcon icon={faUser} style={styles.iconStyle} />
                        </span>
                        <p style={{ color: txtColor, marginLeft: '8px' }}>Guest User</p>
                        </button>

                        <button
                        onClick={() => navigate('/login')}
                        style={styles.btnStyle}
                        >
                        <span className='baricon'>
                            <FontAwesomeIcon icon={faRightToBracket} style={styles.iconStyle} />
                        </span>
                        <p style={{ color: txtColor, marginLeft: '8px' }}>Sign in</p>
                        </button>

                        <button
                        onClick={() => navigate('/register')}
                        style={styles.btnStyle}
                        >
                        <span className='baricon'>
                            <FontAwesomeIcon icon={faUserPlus} style={styles.iconStyle} />
                        </span>
                        <p style={{ color: txtColor, marginLeft: '8px' }}>Sign up</p>
                        </button>

                        <button
                        onClick={() => navigate('/about')}
                        style={styles.btnStyle}
                        >
                        <span className='baricon'>
                            <FontAwesomeIcon icon={faCircleInfo} style={styles.iconStyle} />
                        </span>
                        <p style={{ color: txtColor, marginLeft: '8px' }}>About</p>
                        </button>
                    </div>
                    </div>

                </div>

            </header>

            <main className="public__main">

                <div className='first-box'>

                    <h1><span className='nowrap' style={{color: dark ? '#777777' : 'black'}}>Nexcare Innovate</span></h1>
                    <br />

                    <p className='main-para' style={{color: dark ? 'silver' : '#272525', cursor: 'default'}}>
                        Our experienced and certified medical professionals are dedicated to ensuring the highest standards of accuracy in every test.
                    </p>

                    <div className='doc-card'>
                        <div className="gallery">
                            <img className="doc-img" src={doc} alt='Healthcare' />
                            <p style={{color: txtColor, cursor: 'default'}}>Book your appointment</p>
                        </div>
                    </div>

                </div>
                <br />

                <button className='learn-btn' onClick={() => navigate('/health-care')}>Learn more</button>
                <br />

                <div className='second-box'>
                   
                    <p style={{color: txtColor, cursor: 'default'}}>
                        <span className='para-span'>Best Medical Test. For Everyone.</span><br />
                        <br />
                        These tests encompass a broad spectrum, ranging from routine blood tests to sophisticated imaging procedures such as MRIs and CT scans. With advancements in technology and research, medical tests play an integral role in providing accurate diagnoses, guiding treatment decisions, and promoting overall wellness and quality of life for patients.<br />
                        <br />
                        <span className='link-para' onClick={handlePageRef}>Learn more</span>

                    </p>

                    <img className="doc-img" src={test} alt='Healthcare' />

                </div>
                <br />

                <p className='para' style={{color: txtColor, cursor: 'default'}}>Test with Nexcare Innovate</p>

                <p className='para-public' style={{cursor: 'default'}}>
                    Medical tests are essential for diagnosing and monitoring health conditions, ranging from routine blood tests to advanced imaging techniques. They play a vital role in guiding treatment decisions and promoting overall well-being.
                </p>

                <button className='learn-btn' onClick={() => navigate('/visit-our-medicalcenter')}>Visit our Medical test center</button>

                <div ref={pageRef}>
                    <Page />
                </div>

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


            </main>
    
            <ToastContainer />

        </section>

    )

    return content

}

export default Public
