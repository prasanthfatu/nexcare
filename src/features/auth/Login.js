import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import useAuth from '../../hooks/useAuth'
import axios from '../../app/api/axios'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LOGIN_URL = '/auth'

const Login = () => {

    const { setAuth, persist, setPersist } = useAuth()
    const userRef = useRef()

    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);

    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

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

    const content = (

        <section className="public-login">

            <main className="login">

                <header>
                    <h1>Sign in</h1>
                </header>

                <div>
                    <p className={errClass} aria-live="assertive">{errMsg}</p>

                    <form className="form" onSubmit={handleSubmit}>

                        <label htmlFor="username">Username:</label>
                        <input
                            className="form__input"
                            type="text"
                            id="username"
                            ref={userRef}
                            value={user}
                            onChange={handleUserInput}
                            autoComplete="off"
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            className="form__input"
                            type="password"
                            id="password"
                            onChange={handlePwdInput}
                            value={pwd}
                            required
                        />

                        <button className="form__submit-button" disabled={isDisabled}>Sign In</button>

                        <div>
                            <input
                                type='checkbox'
                                id='persist'
                                onChange={togglePersist}
                                checked={persist}
                            />
                            <label htmlFor='persist'>Trust this device</label>
                        </div>

                    </form>
                </div>

                 <div className='arrow'>
                    <Link to='/'><FontAwesomeIcon icon={faArrowLeft} /></Link>
                </div>

            </main>

            <ToastContainer />

        </section>
    )

    return (
        <div className='login-img'>
            <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>
            {content}
            <p className='login-para'>Please enter your credentials to access your account and explore our platform.</p>
        </div>
    )
    
}
export default Login