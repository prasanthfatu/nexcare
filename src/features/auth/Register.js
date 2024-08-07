import { useRef, useState, useEffect } from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate } from "react-router-dom";
import axios from '../../app/api/axios'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = '/register';

const Register = () => {

    const navigate = useNavigate()

    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {

        e.preventDefault();

        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);

        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
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
            errRef.current.focus();
            setIsDisabled(false)
            setLoading(false)
        }
    }

    return (
        <>  
                <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>

                <section className="register">

                    <ToastContainer />

                    <h1>Sign up</h1>

                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

                    <form className="form" onSubmit={handleSubmit}>

                        <label className="form__label" htmlFor="username">
                            Username: <span className="nowrap">[3-20 letters]</span></label>
                        <input
                            id="username"
                            className="form__input"
                            name="username"
                            type="text"
                            autoComplete="off"
                            value={user}
                            required
                            onChange={(e) => setUser(e.target.value)}
                            autoFocus
                        />

                        <label className="form__label" htmlFor="password">
                            Password: <span className="nowrap">[8-12 chars incl. !@#$%]</span></label>
                        <input
                            id="password"
                            className="form__input"
                            name="password"
                            type="password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                           <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 12 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>



                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            className="form__input"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button className="form__input" disabled={!validName || !validPwd || !validMatch || isDisabled || loading}>Sign Up</button>

                    </form>

                    <p className="line">
                        Already registered?<br />
                        <span>
                            <a href="/login">Sign In</a>
                        </span>
                    </p>

                    <div className='home-link'>
                        <Link to='/'><FontAwesomeIcon icon={faArrowLeft} /></Link>
                    </div>

                </section>
        </>
    )
}

export default Register
