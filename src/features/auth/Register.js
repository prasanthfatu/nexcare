import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate } from "react-router-dom";
import axios from '../../app/api/axios'
import registerImg from '../../img/register.png'
import useAuth from "../../hooks/useAuth";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = '/register';

const Register = () => {

    const navigate = useNavigate()

    const {dark} = useAuth()

    const userRef = useRef();

    const [show, setShow] = useState(false)
    const [user, setUser] = useState('');
    const [isMobile, setIsMobile] = useState(false)

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);

    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);

    const [isFocused, setIsFocused] = useState({
        focusUser: false,
        focusPwd: false,
        focusMatchPwd: false,
        focusHomeArrow: false,
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    const handleSubmit = async (e) => {

        e.preventDefault();

        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);

        if (!v1 || !v2) {
            return;
        }

        try {
            setIsDisabled(true)
            setLoading(true)
            await axios.post(REGISTER_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            //clear state and controlled inputs
            setUser('');
            setPwd('');
            setMatchPwd('');
            navigate('/regsuccess');

        } catch (err) {
            
            console.error(err)

            if (!err?.response) {
                toast.error('No Server Response', {
                    autoClose: 5000,
                    position: "top-center",
                    theme: "light",
                    style: {
                        width: 'auto',
                        height: 'auto',
                        fontSize: "0.8rem"
                    }
                });
            } else if (err.response?.status === 409) {
                toast.error('Username Taken', {
                    autoClose: 5000,
                    position: 'top-center',
                    theme: "light",
                    style: {
                        width: 'auto',
                        height: 'auto',
                        fontSize: "0.8rem"
                    }
                })
            } else {
                toast.error('Registration Failed', {
                    autoClose: 5000,
                    position: 'top-center',
                    theme: "light",
                    style: {
                        width: 'auto',
                        height: 'auto',
                        fontSize: "0.8rem"
                    }
                })
            }
            setIsDisabled(false)
            setLoading(false)
        }
    }

    const handleUserInput = (e) => setUser(e.target.value)
    const handlePwdInput = (e) => setPwd(e.target.value)
    const handleMatchPwdInput = (e) => setMatchPwd(e.target.value)

    const handleFocus = (field) => {
        setIsFocused((prev) => ({
            ...prev, [field]: true
        }))
    }

    const handleBlur = (field) => {
        setIsFocused((prev) => ({
            ...prev, [field]: false
        }))
    }

    const styles = {
    darklabel: {
      color: 'gray', position: 'absolute', transform: 'translate(0, -50%)', backgroundColor: '#0D0D0D', zIndex: 1, transition: 'top 0.3s linear', padding: '2px 5px', marginLeft: '1.5px'
    },
    lightlabel: {
      color: 'gray', position: 'absolute', transform: 'translate(0, -50%)', backgroundColor: '#fff', zIndex: 1, transition: 'top 0.3s linear', padding: '2px 5px', marginLeft: '1.5px'
    },
  }

    return(
           <div>
        
                <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>
        
                <div style={{backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100vw', height: '100vh', display: 'flex', flexDirection: isMobile ? 'column' : 'row'}}>
        
                           {
                            !isMobile && (
                                <div 
                                style={{ backgroundColor: dark ? '#0D0D0D' : '#fff', width: '50vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '25px'}}
                            > 
        
                                <h6 style={{color: dark ? '#EAEAEA' : 'black', cursor: 'default'}}>Nexcare</h6>
        
                                <span style={{ backgroundImage: `url(${registerImg})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '250px', height: '267px', borderRadius: '10px', aspectRatio: 3/2}}></span>
        
                                <p style={{color: dark ? '#EAEAEA' : 'black', fontFamily: 'revert', cursor: 'default', fontSize: '1.1rem', fontWeight: 'bold'}}>
                                    <span style={{color: 'rgb(207, 75, 75)'}}>Please register yourself</span><br />
                                    <span style={{color: 'rgb(81, 146, 177)'}}>to access your account</span>
                                    <span style={{color: 'rgb(64, 116, 64)', marginLeft: '10px'}}>and </span>
                                    <span style={{color: 'rgb(202, 202, 68)'}}>explore our platform.</span>  
                                </p>
        
                            </div>
                            )
                           }
        
                            <section style={{backgroundColor: dark ? '#0D0D0D' : '#fff', width: isMobile ? '100vw' : '50vw', height: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        
                                <main style={{backgroundColor: dark ? '#0D0D0D' : '#fff', width: '90%', height: '90%', position: 'absolute', top: '5%', left: '5%', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, padding: isMobile ? '10px' : '25px', borderRadius: isMobile ? '10px' : '25px', overflowY: 'auto', scrollbarWidth: 'none'}}>
        
                                    <header>
                                        <h4 className="sign-reg-header" style={{color: dark ? '#EAEAEA' : 'black'}}>Sign Up</h4>
                                    </header>
        
                                    <div>
        
                                        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        
                                        {/* Username */}
                                        <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>
        
                                            <label 
                                                style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusUser || user !== '') ? '20px' : '48px', left: (isFocused.focusUser || user !== '') ? '30px' : '30px', fontSize: (isFocused.focusUser || user !== '') ? '13px' : '16px'}}
                                            >
                                                Username
                                            </label>
        
                                            <input 
                                                style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                                                onFocus={() => handleFocus('focusUser')}
                                                onBlur={() => handleBlur('focusUser')}
                                                type="text" 
                                                name="username" 
                                                autoComplete='off'
                                                id="username"
                                                ref={userRef}
                                                value={user}
                                                onChange={handleUserInput}
                                                required
                                            />

                                            {isFocused.focusUser && (
                                                <div
                                                        style={{
                                                        position: 'absolute',
                                                        top: '82px',
                                                        left: '10px',
                                                        backgroundColor: dark ? '#222' : '#f9f9f9',
                                                        padding: '8px 12px',
                                                        borderRadius: '6px',
                                                        fontSize: '13px',
                                                        color: USER_REGEX.test(user) ? 'lightgreen' : 'red',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                        zIndex: 10,
                                                        transition: 'opacity 0.3s ease',
                                                        opacity: isFocused.focusUser ? 1 : 0
                                                        }}
                                                    >
                                                        [ 3-20 letters ]
                                                </div>      
                                            )}                                                    
        
                                        </div>
        
                                        {/* Password */}
                                        <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>
        
                                            <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusPwd || pwd !== '') ? '20px' : '48px', left: (isFocused.focusPwd || pwd !== '') ? '30px' : '30px', fontSize: (isFocused.focusPwd || pwd !== '') ? '13px' : '16px'}}>
                                                Password
                                            </label>
        
                                            <input 
                                                style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                                                onFocus={() => handleFocus('focusPwd')}
                                                onBlur={() => handleBlur('focusPwd')} 
                                                name="password"
                                                type={show ? 'text' : 'password'}
                                                id="password"
                                                onChange={handlePwdInput}
                                                value={pwd}
                                                required
                                            />
        
                                            <span onClick={() => setShow(!show)} style={{position: 'absolute', top: '25%', right: '10%', transform: 'translate(50%, 50%)', color: 'gray'}}>{show ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</span>

                                            {isFocused.focusPwd && (
                                                    <div
                                                        style={{
                                                        position: 'absolute',
                                                        top: '82px',
                                                        left: '10px',
                                                        backgroundColor: dark ? '#222' : '#f9f9f9',
                                                        padding: '8px 12px',
                                                        borderRadius: '6px',
                                                        fontSize: '13px',
                                                        color: PWD_REGEX.test(pwd) ? 'lightgreen' : 'red',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                        zIndex: 10,
                                                        transition: 'opacity 0.3s ease',
                                                        opacity: isFocused.focusPwd ? 1 : 0
                                                        }}
                                                    >
                                                        Must contain 8-24 characters, uppercase, lowercase, number, special (!@#$%)
                                                    </div>
                                            )}

                                        </div>

                                        {/* Confirm Password */}
                                        <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>
        
                                            <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusMatchPwd || matchPwd !== '') ? '20px' : '48px', left: (isFocused.focusMatchPwd || matchPwd !== '') ? '30px' : '30px', fontSize: (isFocused.focusMatchPwd || matchPwd !== '') ? '13px' : '16px'}}>
                                                Confirm Password
                                            </label>
        
                                            <input 
                                                style={{backgroundColor: 'transparent', width: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', outline: 'none', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? 'white' : 'black', padding: '16px 10px'}}
                                                onFocus={() => handleFocus('focusMatchPwd')}
                                                onBlur={() => handleBlur('focusMatchPwd')} 
                                                name="confirm password"
                                                type={show ? 'text' : 'password'}
                                                id="confirm password"
                                                onChange={handleMatchPwdInput}
                                                value={matchPwd}
                                                required
                                            />
    
                                             {isFocused.focusMatchPwd && (
                                                    <div
                                                        style={{
                                                        position: 'absolute',
                                                        top: '82px',
                                                        left: '10px',
                                                        backgroundColor: dark ? '#222' : '#f9f9f9',
                                                        padding: '8px 12px',
                                                        borderRadius: '6px',
                                                        fontSize: '13px',
                                                        color:  validPwd && validMatch ? 'lightgreen' : 'red',
                                                        boxShadow: '0 2px 8px rgba(3, 3, 3, 0.1)',
                                                        zIndex: 10,
                                                        transition: 'opacity 0.3s ease',
                                                        opacity: isFocused.focusMatchPwd ? 1 : 0
                                                        }}
                                                    >
                                                        Must match the first password input field
                                                    </div>
                                            )}
        
                                        </div>
        
        
                                        <button className="form__submit-button" disabled={isDisabled} style={{opacity: isDisabled ? 0.3 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer'}}>Sign Up</button>
        
                                        </form>
        
                                    </div>

                                    <p className="line" style={{color: dark ? '#EAEAEA' : 'black', marginLeft: '10px', fontSize: '14px', fontFamily: 'monospace', cursor: 'default'}}>Already registered?<br />
                                        <span><a href="/login" style={{cursor: 'pointer', color: dark ? '#EAEAEA' : 'black'}}>Sign In</a></span>
                                    </p>

                                    <div 
                                        style={{position: 'relative', width: 'fit-content'}}
                                        onMouseEnter={() => handleFocus('focusHomeArrow')}
                                        onMouseLeave={() => handleBlur('focusHomeArrow')}
                                    >
                                        <Link to='/'><FontAwesomeIcon icon={faArrowLeft} style={{color: dark ? '#EAEAEA' : 'black', marginTop: '35px'}} /></Link>
                                        <span style={{display: isFocused.focusHomeArrow ? 'block' : 'none', position: 'absolute', bottom: '40%', left: '100%',  border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? '#EAEAEA' : 'black', whiteSpace: 'nowrap', fontSize: '10px', padding: '5px'}}>Back to home</span>
                                    </div>

                                    {
                                    isMobile && (
                                        <div style={{ padding: '5px'}}>
                                            <p style={{color: dark ? '#EAEAEA' : 'black', fontFamily: 'revert', cursor: 'default', fontSize: isMobile ? '0.5rem' : '1.1rem', fontWeight: 'bold', textAlign: 'end'}}>
                                                <span style={{color: 'rgb(207, 75, 75)'}}>Please register yourself</span><br />
                                                <span style={{color: 'rgb(81, 146, 177)', marginLeft: '2px'}}>to access your account</span><br />
                                                <span style={{color: 'rgb(64, 116, 64)', marginLeft: '2px'}}>and </span><br />
                                                <span style={{color: 'rgb(202, 202, 68)'}}>explore our platform.</span>  
                                            </p>
                                        </div>
                                    )
                                    }
        
                                
                                </main>
        
                                <ToastContainer />
        
                            </section>
        
                </div>
                       
            </div>
    )
}

export default Register
