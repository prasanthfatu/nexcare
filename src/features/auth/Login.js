import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import useAuth from '../../hooks/useAuth'
import axios from '../../app/api/axios'
import log1 from '../../img/log1.jpg'
import log2 from '../../img/log2.jpg'
import log3 from '../../img/log3.jpg'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LOGIN_URL = '/auth'

const Login = () => {

    const { setAuth, persist, setPersist, dark } = useAuth()
    const userRef = useRef()

    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);

    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [isMobile, setIsMobile] = useState(false)     
    const images = [log1, log2, log3]
    const [currentIndex, setCurrentIndex] = useState(0)

    const [isFocused, setIsFocused] = useState({
        focusUser: false,
        focusPwd: false,
        focusHomeArrow: false
    });

    const navigate = useNavigate()
    const goNext = useCallback(() => {
        const isLast = currentIndex === images.length - 1
        const result = isLast ? 0 : currentIndex + 1
        setCurrentIndex(result)
    }, [currentIndex, images.length])

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
        setErrMsg('');
    }, [user, pwd])

    useEffect(() => {
        if(images.length === 0) return
        const id = setTimeout(() => {
            goNext()
        }, 3000)
        return () => clearTimeout(id)
    }, [goNext, images.length])

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            setIsDisabled(true)
            setLoading(true)
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const accessToken = response?.data?.accessToken;
            setAuth({ user, accessToken });
            setUser('');
            setPwd('');
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

    const handleUserInput = (e) => setUser(e.target.value)
    const handlePwdInput = (e) => setPwd(e.target.value)

    const errClass = errMsg ? "errmsg" : "offscreen"

    const togglePersist = () => {
        setPersist(prev => !prev)
    }

    useEffect(() => {
        localStorage.setItem('persist', persist)
    }, [persist])

      const handleFocus = (field) => {
    setIsFocused((prev) => ({
      ...prev, [field] : true
    }))
  }

   const handleBlur = (field) => {
    setIsFocused((prev) => ({
      ...prev, [field] : false
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

    return (

           <div>

                <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>

                <div style={{backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100vw', height: '100vh', display: 'flex', flexDirection: isMobile ? 'column' : 'row'}}>

                   {
                    !isMobile && (
                         <div 
                        style={{ backgroundColor: dark ? '#0D0D0D' : '#fff', width: '50vw', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '5px'}}
                    > 

                        <p style={{color: dark ? '#EAEAEA' : '#0D0D0D', cursor: 'default', fontSize: '14px'}}>Nexcare</p>

                        <span style={{width: '95%', height: '400px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <img 
                                src={`${images[currentIndex]}`}
                                alt={`slide-${currentIndex}`}
                                loading='lazy'
                                style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', transition: 'all 0.7s ease'}}
                            />
                        </span>

                        <p style={{color: dark ? '#EAEAEA' : 'black', fontFamily: 'revert', cursor: 'default', fontSize: '1rem', fontWeight: '500'}}>
                            <span style={{color: 'rgb(207, 75, 75)'}}>Please enter your credentials</span><br />
                            <span style={{color: 'rgb(81, 146, 177)'}}>to access your account</span>
                            <span style={{color: 'rgba(19, 155, 110, 1)', marginLeft: '10px'}}>and </span>
                            <span style={{color: 'rgb(202, 202, 68)'}}>explore our platform.</span>  
                        </p>

                    </div>
                    )
                   }

                    <section style={{backgroundColor: dark ? '#0D0D0D' : '#fff', width: isMobile ? '100vw' : '50vw', height: '100dvh', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

                        <main style={{backgroundColor: dark ? '#0D0D0D' : '#fff', width: '90%', height: '90%', position: 'absolute', top: '5%', left: '5%', border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, padding: isMobile ? '10px' : '25px', borderRadius: isMobile ? '10px' : '25px', overflowY: 'auto', scrollbarWidth: 'none'}}>

                            <header>
                                <h1 className='sign-reg-header' style={{color: dark ? '#EAEAEA' : 'black'}}>Sign in</h1>
                            </header>

                            <div>
                                <p className={errClass} aria-live="assertive">{errMsg}</p>

                                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

                                {/* Username */}
                                <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>

                                    <label 
                                        style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusUser || user !== '') ? '20px' : '48px', left: (isFocused.focusUser || user !== '') ? '30px' : '30px', fontSize: (isFocused.focusUser || user !== '') ? '13px' : '16px', pointerEvents: 'none'}}
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

                                </div>


                                {/* Password */}
                                <div style={{position: 'relative', backgroundColor: dark ? '#0D0D0D' : '#fff', width: '100%', height: '100px'}}>

                                    <label style={{...(dark ? styles.darklabel : styles.lightlabel), top: (isFocused.focusPwd || pwd !== '') ? '20px' : '48px', left: (isFocused.focusPwd || pwd !== '') ? '30px' : '30px', fontSize: (isFocused.focusPwd || pwd !== '') ? '13px' : '16px',  pointerEvents: 'none'}}>
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

                                </div>


                                <button className="form__submit-button" disabled={isDisabled}  style={{opacity: isDisabled ? 0.3 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer'}}>Sign In</button>

                                </form>

                            </div>

                            <div style={{marginTop: '10px'}}>
                                <input
                                    type='checkbox'
                                    id='persist'
                                    onChange={togglePersist}
                                    checked={persist}
                                />
                                <label htmlFor='persist' style={{color: dark ? '#EAEAEA' : 'black', marginLeft: '10px', fontSize: '14px', fontFamily: 'monospace'}}>Trust this device</label>
                            </div>

                            <div 
                                className='arrow' style={{position: 'relative', width: 'fit-content'}}
                                onMouseEnter={() => handleFocus('focusHomeArrow')}
                                onMouseLeave={() => handleBlur('focusHomeArrow')}

                            >
                                <Link to='/'><FontAwesomeIcon icon={faArrowLeft} style={{color: dark ? '#EAEAEA' : 'black'}} /></Link>
                                <span style={{display: isFocused.focusHomeArrow ? 'block' : 'none', position: 'absolute', bottom: '100%', left: '100%',  border: dark ?  `0.01px solid #333333`:  `0.01px solid #ccc`, color: dark ? '#EAEAEA' : 'black', whiteSpace: 'nowrap', fontSize: '10px', padding: '5px'}}>Back to home</span>
                            </div>

                            {
                            isMobile && (
                                <div style={{ padding: '5px'}}>
                                    <p style={{color: dark ? '#EAEAEA' : 'black', fontFamily: 'revert', cursor: 'default', fontSize: isMobile ? '0.5rem' : '1.1rem', fontWeight: 'bold', textAlign: 'end'}}>
                                        <span style={{color: 'rgb(207, 75, 75)'}}>Please enter your credentials</span><br />
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
export default Login