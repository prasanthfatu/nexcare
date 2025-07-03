import { useEffect, useRef, useState, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faUser, faBell, faXmark, faBars, faPen, faMoon, faSun } from "@fortawesome/free-solid-svg-icons"
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

    const imgURL = 'https://nexcare-api.onrender.com/img/'

    const {profileNotify} = useNotifyCount()
    
    const [imageSrc, setImageSrc] = useState('');

    const { auth, profile, notificationLen, setBarIcon, barIcon, dark, setDark } = useAuth()

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
    const [hide, setHide] = useState(false)

    const {getProfile} = useProfile(name, auth)
    
    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 200){
                setHide(true)
            }else{
                setHide(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    useEffect(() => {
        getCoverPhoto()
        getProfile()
    }, [getCoverPhoto, getProfile])

    useEffect(() => {
        const fetchImage = async () => {
          try {
              
            if(!profile || !profile.name || !profile.image) return;
              
            const imageUrl = `${imgURL}${profile.name}/${profile.image}`;
              
            const response = await axiosPrivate.get(imageUrl, {
              responseType: 'blob',
              headers: {
                'Authorization': `Bearer ${auth?.accessToken}`,
              },
              withCredentials: true,
            });
        
            // Convert the Blob to an object URL and set it as the image source
            const imageObjectUrl = URL.createObjectURL(response.data);
            setImageSrc(imageObjectUrl);            
    
          } catch (error) {
            console.error('Error fetching the image:', error);
          }
        };
    
        fetchImage();
    
      }, [auth?.accessToken, profile, axiosPrivate]);    
    
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

    const handleProNav = () => {
        setNavbar(false)
        handleProfileBar()
    }

    const content = (

        <header 
            className='nav'
            style={{backgroundColor: dark ? 'black' : 'aliceblue', transform: hide ? 'translateY(-100%)' : 'translateY(0)', transition: 'transform 0.5s ease', borderBottom: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}
        >

            <div className='nav-name'>

                <div ref={barIconRef} className='nav-name-icon'>

                    <p className='nav-name-baricon' onClick={() => setBarIcon(!barIcon)}><FontAwesomeIcon icon={faBars} style={{color: dark ? '#EAEAEA' : 'black'}} /></p>

                    <div className={`board-container ${ barIcon ? 'active' : 'inactive'}`} style = {{backgroundColor: dark ? 'black' : 'aliceblue', border: dark ? '0.01px solid #333333' : '0.01px solid #ccc', transform: barIcon ? 'translateX(0)' : 'translateX(-1000px)', transition: 'transform 0.5s ease'}}>

                        <div className='board-close'>
                            <p className='board-container-cls' onClick={() => setBarIcon(false)}><FontAwesomeIcon icon={faXmark} /></p>
                        </div>

                        <h4 className='welcome-name' style={{color: dark ? '#777777' : 'gray'}}>{name ? `Welcome ${name} !` : 'Welcome!'}</h4>
                
                        <div className='board-list'>

                            <Link to="/account/medicaltest" style={{width: '100%'}}>
                                <div className={`board-img ${dark ? 'dark' : 'light'}`} onClick={() => setBarIcon(false)} >
                                        <img className='img-add' src={addpatient} alt="Healthcare" />
                                        <p className='board-para' style={{color: dark ? '#BBBBBB' : 'black', fontWeight: '500'}}>Add New Patient</p>
                                </div>
                            </Link>

                            <Link to="/account/patients" style={{width: '100%'}}>
                                <div className={`board-img ${dark ? 'dark' : 'light'}`} onClick={() => setBarIcon(false)} >
                                    <img src={patientslist} alt="Healthcare" />
                                    <p className='board-para' style={{color: dark ? '#BBBBBB' : 'black', fontWeight: '500'}}>Patient List</p>
                                </div>
                            </Link>

                            <Link to="/account/new-appointment" style={{width: '100%'}}>
                                <div className={`board-img ${dark ? 'dark' : 'light'}`} onClick={() => setBarIcon(false)} >
                                    <img src={appointment} alt="Healthcare" />
                                    <p className='board-para' style={{color: dark ? '#BBBBBB' : 'black', fontWeight: '500'}}>Reserve Appointment</p>
                                </div>
                            </Link>

                            <Link to="/account/appointments" style={{width: '100%'}}>
                                <div className={`board-img ${dark ? 'dark' : 'light'}`} onClick={() => setBarIcon(false)} >
                                    <img src={appointmentslist} alt="Healthcare" />
                                    <p className='board-para' style={{color: dark ? '#BBBBBB' : 'black', fontWeight: '500'}}>View All Appointments</p>
                                </div>
                            </Link>

                            <Link to="/account/appointmentsuccess" style={{width: '100%'}}>
                                <div className={`board-img ${dark ? 'dark' : 'light'}`} onClick={() => setBarIcon(false)} >
                                    <img src={trackstatus} alt="Healthcare" />
                                    <p className='board-para' style={{color: dark ? '#BBBBBB' : 'black', fontWeight: '500'}}>Track Status</p>
                                </div>
                            </Link>

                        </div>
                        <div style={{height: '50dvh', position: 'relative'}}>
                            <Link to="/account/users">
                                <div className={`board-img ${dark ? 'dark' : 'light'}`} style={{justifyContent: 'start', alignItems: 'center', width: '100%', borderTop: dark ? '0.01px solid #333333' : '0.01px solid #ccc', position: 'absolute', bottom: '7dvh'}} onClick={() => setBarIcon(false)} >
                                    <img src={usersetting} alt="Healthcare" />
                                    <p className='board-para' style={{color: dark ? '#BBBBBB' : 'black', fontWeight: '500'}}>View User Settings</p>
                                </div>
                            </Link>
                        </div>

                    </div>
        
                </div>

                <Link to='/account' style={{color: dark ? '#EAEAEA' : 'black'}}><p>Nexcare</p></Link>

            </div>

            <div className='nav-end'>

                <div 
                    onClick={() => setDark(!dark)}
                    className='darkmode'
                    style={{backgroundColor: dark ? 'black' : 'aliceblue', border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}
                >
                    <FontAwesomeIcon icon={dark ? faMoon : faSun} style={{color: dark ? '#EAEAEA' : 'black'}} />
                </div>
               
                <div ref={notifyRef}>

                    <div onClick={() => setOpenNotificationBar(!openNotificationBar) } className='navbar-bell' style={{border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}>

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

                        <FontAwesomeIcon className='bell-icon' icon={faBell} style={{color: dark ? 'white' : 'black'}} />
                        <p className='notify-hover' style={{backgroundColor: dark ? 'gray' : 'black', color: 'white'}}>Notifications</p>

                    </div>
                    
                    <div className={`notification-container ${openNotificationBar ? 'active' : 'inactive'}`}
                        style={{backgroundColor: dark ? '#272525' : 'white'}}
                    >
                        <Notifications setOpenNotificationBar = {setOpenNotificationBar} refreshNotiyLength={profileNotify} />
                    </div>

                </div>

                <div ref={sidebarRef} className='profile'>

                    <div className='navbar-user-position'>

                        <div onClick={() => setOpenSidebar(!openSidebar)} className='nav-profile'>
                            { profile ? (
                                <div>
                                    <img src={imageSrc} alt='profile' className='profile-picture-head' />
                                </div>
                            ) : <div className = 'profile-pic-icon' style={{border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}><FontAwesomeIcon icon={faUser} style={{color: dark ? 'white' : 'black'}} /></div> }
                            <p className='navbar-user' style={{backgroundColor: dark ? 'gray' : 'black', color: 'white'}}>Profile</p>
                        </div>

                    </div>

                    <div className={`profile-menu ${openSidebar ? 'active' : 'inactive'}`}>

                        <ul className='proclose' style={{backgroundColor: dark ? '#272525' : 'white'}}>

                            <li className='close-icon' onClick={() => setOpenSidebar(false)}>
                                <FontAwesomeIcon icon={faXmark} style={{color: dark ? 'silver' : 'black'}} />
                            </li>

                            <li className='profile-name' style={{color: dark ? 'silver' : 'black'}}>{name}</li>

                            <li className='profile-edit-container'>
                                <div className='profile-edit-section' onClick={handleMyProfile}>
                                    {
                                        profile ? (
                                            <img src={imageSrc} alt='profile-pic' className='profile-edit-img' />
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

            <div ref={navbarRef} className="navbar">

                <div className="navbar bar" onClick={() => setNavbar(!navbar)}>
                    <FontAwesomeIcon icon={faBars} style={{ color: dark ? 'white' : 'black' }} />
                </div>

                <div className={`navbar-container ${navbar ? 'active' : 'inactive'}`} style={{ backgroundColor: dark ? 'gray' : 'white' }}>

                    <div className="barnotify-position">

                    {/* User Info */}
                    <div className="bar-roles" style={{ backgroundColor: dark ? 'silver' : '#ecf3feff', color: dark ? 'white' : 'gray' }}>
                        <p className="profile-name" style={{ color: dark ? '#272525' : 'black' }}>{name}</p>
                        <p className="pro-status" style={{ color: dark ? 'gray' : '#333333' }}>{roles}</p>
                    </div>

                    {/* Menu Items */}
                    <div>

                        {/* Dark Mode Toggle */}
                        <div 
                        className="bar-icons" 
                        onClick={() => setDark(!dark)} 
                        style={{ cursor: 'pointer' }}
                        >
                        <span><FontAwesomeIcon icon={dark ? faSun : faMoon} style={{ color: dark ? 'white' : 'black', marginLeft: '0.5rem' }} /></span>
                        <p style={{ color: dark ? 'white' : 'black', whiteSpace: 'nowrap' }}>
                            Dark Mode <span style={{ color: dark ? 'purple' : 'gray', fontWeight: 'bold', fontSize: '10px' }}>{dark ? 'on' : 'off'}</span>
                        </p>
                        </div>

                        {/* Profile */}
                        <div 
                        className="bar-icons" 
                        onClick={handleProNav} 
                        style={{ color: dark ? 'white' : 'black', cursor: 'pointer' }}
                        >
                        <div className="barimg-container">
                            {profile ? (
                            <img src={imageSrc} alt="profile-pic" className="navprofile-img" style={{marginLeft: '0.2rem'}} />
                            ) : (
                            <FontAwesomeIcon icon={faUser} style={{marginLeft: '0.5rem'}} />
                            )}
                        </div>
                        <p>Profile</p>
                    </div>

                    {/* Notifications */}
                    <Link 
                    to="/account/notifications-bar" 
                    onClick={() => setNavbar(false)} 
                    style={{ textDecoration: 'none' }}
                    >
                    <div 
                        className="bar-icons" 
                        style={{ color: dark ? 'white' : 'black', cursor: 'pointer'}}
                    >
                        <div>
                            {filterednotifications.length > 0 && (
                                <p className="barnotify-para">{filterednotifications.length}</p>
                            )}
                            <span><FontAwesomeIcon icon={faBell} style={{ color: dark ? 'white' : 'black', marginLeft: '0.5rem'}} /></span>
                        </div>
                        <p style={{ color: dark ? 'white' : 'black' }}>Notifications</p>
                    </div>
                    </Link>

                    {/* Sign Out */}
                    <div 
                    className="bar-icons" 
                    onClick={signOutBar} 
                    style={{ cursor: 'pointer' }}
                    >
                    <span><FontAwesomeIcon icon={faRightFromBracket} style={{ color: dark ? 'white' : 'black', marginLeft: '0.5rem' }} /></span>
                    <p style={{ color: dark ? 'white' : 'black' }}>Sign out</p>
                    </div>

                </div>
            </div>
        </div>
            </div>


    </header>
    )

    return content

}

export default DashHeader 
