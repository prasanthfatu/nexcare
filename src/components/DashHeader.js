import { useEffect, useRef, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faUser, faBell, faXmark, faBars, faPen } from "@fortawesome/free-solid-svg-icons"
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import Notifications from '../features/appointment/Notifications'
import useProfile from '../hooks/useProfile'
import useNotifyCount from '../hooks/useNotifyCount'
import useCoverPhoto from '../hooks/useCoverPhoto'
import addpatient from '../img/add-patient.png'
import patientslist from '../img/patients-list.png'
import appointment from '../img/appointment.png'
import appointmentslist from '../img/appointments-list.png'
import trackstatus from '../img/track-status.png'
import usersetting from '../img/user-settings.png'

const DashHeader = () => {

    const URL = 'http://localhost:3500/img/'

    const {profileNotify} = useNotifyCount()

    const { auth, profile, notificationLen, setBarIcon, barIcon } = useAuth()

    const decode = auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined

    const name = decode.UserInfo.username || []
    const roles = decode.UserInfo.roles || []

    const {getCoverPhoto} = useCoverPhoto(name)

    const notificationId = useParams()
    const notId = notificationId.notId;

    const sidebarRef = useRef()
    const navbarRef = useRef()
    const notifyRef = useRef()

    const barIconRef = useRef()

    const navigate = useNavigate()
    const axiosPrivate = useAxiosPrivate()

    const [openNotificationBar, setOpenNotificationBar] = useState(false)
    const [openSidebar, setOpenSidebar] = useState(false)
    const [navbar, setNavbar] = useState(false)

    const {getProfile} = useProfile(name, auth)
    
    useEffect(() => {
        getCoverPhoto()
        getProfile()
    }, [getCoverPhoto, getProfile])

    useEffect(() => {
        const handleBarIcon = (e) => {
            if(!barIconRef.current.contains(e.target)){
                setBarIcon(false)
            }
        }
        document.addEventListener('mousedown', handleBarIcon)
        return () => document.removeEventListener('mousedown', handleBarIcon)
    }, [setBarIcon])

    useEffect(() => {
        let notifyBar = (e) => {
            if (!notifyRef.current.contains(e.target)) {
                setOpenNotificationBar(false)
            }
        }
        document.addEventListener('mousedown', notifyBar)

        return () => document.removeEventListener('mousedown', notifyBar)
    }, [])

    useEffect(() => {
        let handleSidebar = (e) => {
            if (!sidebarRef.current.contains(e.target)) {
                setOpenSidebar(false)
            }
        }
        document.addEventListener('mousedown', handleSidebar)

        return () => document.removeEventListener('mousedown', handleSidebar)
    }, []);

    useEffect(() => {
        let handlenavbar = (e) => {
            if (!navbarRef.current.contains(e.target)) {
                setNavbar(false)
            }
        }
        document.addEventListener('mousedown', handlenavbar)

        return () => document.removeEventListener('mousedown', handlenavbar)

    }, [])

    const readNotification = useCallback(async (notId) => {

        // Check if notId is defined
        if (!notId) {
            return;
        }

        try {
            await axiosPrivate.put(`/notifications/${notId}`)
            profileNotify()
        } catch (err) {
            console.error(err);
        }

    }, [axiosPrivate, profileNotify])
 
    useEffect(() => {
        profileNotify()
        readNotification(notId)
    }, [profileNotify, readNotification, notId])

    let filterednotifications = notificationLen.filter(notification => {
        return notification.recipient === name && notification.read === false
    })

    const signOut = async () => {
            setOpenSidebar(false)
            navigate('/account/signout')
    }

    const signOutBar = async () => {
        setNavbar(false)
        navigate('/account/signout')
    }
    
    const handleMyProfile = () => {
        setOpenSidebar(false)
        navigate('/account/my-profile')
    }

    const handleProfileBar = () => {
        navigate('/account/my-profile')
    }

    const content = (

        <header className='nav'>

            <div className='nav-name'>

                <div ref={barIconRef} className='nav-name-icon'>

                    <p className='nav-name-baricon' onClick={() => setBarIcon(!barIcon)}><FontAwesomeIcon icon={faBars} /></p>

                    <div className={`board-container ${ barIcon ? 'active' : 'inactive'}`}>

                        <div className='board-close'>
                            <p className='board-container-cls' onClick={() => setBarIcon(false)}><FontAwesomeIcon icon={faXmark} /></p>
                        </div>

                        <h4 className='welcome-name'>{name ? `Welcome ${name} !` : 'Welcome!'}</h4>
                
                        <div className='board-list'>

                            <Link to="/account/medicaltest">
                                <div className='board-img' onClick={() => setBarIcon(false)} >
                                        <img className='img-add' src={addpatient} alt="Healthcare" />
                                        <p className='board-para'>Add New Patient</p>
                                </div>
                            </Link>

                            <Link to="/account/patients">
                                <div className='board-img' onClick={() => setBarIcon(false)} >
                                    <img src={patientslist} alt="Healthcare" />
                                    <p className='board-para'>Patient List</p>
                                </div>
                            </Link>

                            <Link to="/account/new-appointment">
                                <div className='board-img' onClick={() => setBarIcon(false)} >
                                    <img src={appointment} alt="Healthcare" />
                                    <p className='board-para'>Reserve Appointment</p>
                                </div>
                            </Link>

                            <Link to="/account/appointments">
                                <div className='board-img' onClick={() => setBarIcon(false)} >
                                    <img src={appointmentslist} alt="Healthcare" />
                                    <p className='board-para'>View All Appointments</p>
                                </div>
                            </Link>

                            <Link to="/account/appointmentsuccess">
                                <div className='board-img' onClick={() => setBarIcon(false)} >
                                    <img src={trackstatus} alt="Healthcare" />
                                    <p className='board-para'>Track Status</p>
                                </div>
                            </Link>

                            <Link to="/account/users">
                                <div className='board-img' onClick={() => setBarIcon(false)} >
                                    <img src={usersetting} alt="Healthcare" />
                                    <p className='board-para'>View User Settings</p>
                                </div>
                            </Link>

                        </div>

                    </div>

                </div>

                <Link to='/account'><p>Nexcare</p></Link>

            </div>

            <div className='nav-end'>
               
                <div ref={notifyRef}>

                    <div onClick={() => setOpenNotificationBar(!openNotificationBar) } className='navbar-bell'>

                        <div className='notify'>

                            <div className='notify-container'>
                                {
                                    filterednotifications.length === 0 ? (
                                        <div className='notify-para-hide'>
                                            {null}
                                        </div>
                                    ) : (
                                        <p className='notify-para'>{filterednotifications.length}</p>
                                    )
                                }
                            </div>

                        </div>

                        <FontAwesomeIcon icon={faBell} className='bell-icon' />
                        <p className='notify-hover'>Notifications</p>

                    </div>
                    
                    <div className={`notification-container ${openNotificationBar ? 'active' : 'inactive'}`}>
                        <Notifications setOpenNotificationBar = {setOpenNotificationBar} refreshNotiyLength={profileNotify} />
                    </div>

                </div>

                <div ref={sidebarRef} className='profile'>

                    <div className='navbar-user-position'>

                        <div onClick={() => setOpenSidebar(!openSidebar)} className='nav-profile'>
                            { profile ? (
                                <div>
                                    <img src={`${URL}${profile.name}/${profile.image}`} alt='profile' className='profile-picture-head' />
                                </div>
                            ) : <div className = 'profile-pic-icon'><FontAwesomeIcon icon={faUser} /></div> }
                            <p className='navbar-user'>Profile</p>
                        </div>

                    </div>

                    <div className={`profile-menu ${openSidebar ? 'active' : 'inactive'}`}>

                        <ul className='proclose'>

                            <li className='close-icon' onClick={() => setOpenSidebar(false)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </li>

                            <li className='profile-name'>{name}</li>

                            <li className='profile-edit-container'>
                                <div className='profile-edit-section' onClick={handleMyProfile}>
                                    {
                                        profile ? (
                                            <img src={`${URL}${profile.name}/${profile.image}`} alt='profile-pic' className='profile-edit-img' />
                                        ) : (
                                            <div className='alt-text'></div>
                                        )
                                    }
                                </div>
                                <div className='profile-edit-icon' onClick={handleMyProfile}>
                                    <FontAwesomeIcon icon={faPen} />
                                </div>
                            </li>

                            <li className='pro-status'>{roles}</li>

                            <li className='signout' onClick={signOut}>
                                <FontAwesomeIcon icon={faRightFromBracket} />
                                <p>Sign out</p>
                            </li>

                        </ul>
                        
                    </div>

                </div>

            </div>

            <div ref={navbarRef} className='navbar'>

                <div className="navbar bar" onClick={() => setNavbar(!navbar)}>
                    <FontAwesomeIcon icon={faBars} />
                </div>

                <div className={`navbar-container ${navbar ? 'active' : 'inactive'} `}>

                    <div className='barnotify-position'>

                        <ul>

                            <div className='bar-roles'>
                                <li className='profile-name'>{name}</li>
                                <li className='pro-status'>{roles}</li>
                            </div>

                            <div className='scroll-bar'>

                                <div className='bar-icons' onClick={() => setNavbar(false)}>

                                    <li className='barimg-container'>
                                        {
                                            profile ? (
                                                <img src={`${URL}${profile.name}/${profile.image}`} alt='profile-pic' className='navprofile-img' onClick={handleProfileBar}/>
                                            ) : (
                                                <FontAwesomeIcon icon={faUser} onClick={handleProfileBar} />
                                            )
                                        }
                                    </li>

                                    <p onClick={handleProfileBar}>Profile</p>

                                </div>

                                <div className='bar-icons barnotify-container'>

                                    <div className='barnotiy'>

                                        <Link to='/account/notifications-bar'>
                                            {
                                                filterednotifications.length === 0 ? (
                                                    <div className='barnotify-para-hide'>
                                                        {null}
                                                    </div>
                                                ) : (
                                                    <p className='barnotify-para'onClick={() => setNavbar(false)}>{filterednotifications.length}</p>
                                                )
                                            }
                                        </Link>

                                        <Link to='/account/notifications-bar'><li onClick={() => setNavbar(false)}><FontAwesomeIcon icon={faBell} /></li></Link>
                                    
                                    </div>

                                    
                                    <Link to='/account/notifications-bar'><p onClick={() => setNavbar(false)}>Notifications</p></Link>
                                
                                </div>

                                <div className='bar-icons' onClick={signOutBar}>
                                    <li>
                                        <FontAwesomeIcon icon={faRightFromBracket} />
                                    </li>
                                    <p>Sign out</p>
                                </div>

                            </div>

                        </ul>

                    </div>

                </div>

            </div>

        </header>
    )

    return content

}

export default DashHeader 