import { createContext, useState } from 'react'

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({})
    const [patients, setPatients] = useState([])
    const [track, setTrack] = useState({})
    const [appId, setAppId] = useState('null')

    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false)

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(true)

    const [profile, setProfile] = useState('')
    const [bgCover, setBgCover] = useState(null)

    const [notificationLen, setNotificationLen] = useState([]);

    const [barIcon, setBarIcon] = useState(false)

    const openSidebar = () => {
        setIsSidebarOpen(true)
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

    const openSubmenu= () => {
        setIsSubmenuOpen(true)
    }

    const closeSubmenu = () => {
        setIsSubmenuOpen(false)
    }

    return(
        <AuthContext.Provider value={{auth,
         setAuth, 
         persist, 
         setPersist, 
         patients, 
         setPatients, 
         track, 
         setTrack,
         isSidebarOpen,
         isSubmenuOpen,
         openSubmenu,
         closeSubmenu,
         openSidebar,
         closeSidebar,
         appId,
         setAppId,
         profile,
         setProfile,
         notificationLen,
         setNotificationLen,
         bgCover,
         setBgCover,
         barIcon,
         setBarIcon
         }}>
            {children}
        </AuthContext.Provider>
    )

}

export default AuthContext
