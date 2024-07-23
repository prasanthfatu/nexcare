import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import useLogout from "../hooks/useLogout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef } from "react"

const Sidebar = () => {

    const sidebarRef = useRef(null)

    const {isSidebarOpen, closeSidebar} = useAuth()
    const logout = useLogout()
    const navigate = useNavigate()

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                closeSidebar();
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleSidebarClick = (e) => {
        e.stopPropagation();
    }
 
    const signOut = async() => {
        await logout();
        navigate('/')
    }

  return (

    <aside className={`${isSidebarOpen ? 'sidebar-wrapper show' : 'sidebar-wrapper'}`}>

        <div className="sidebar">
            <button className="sidebar-cls-btn" onClick={closeSidebar}>
                <FontAwesomeIcon icon={faXmark} />
            </button>
        </div>

        <ul className="nav-links">   
            <li>
                <button onClick={signOut}>
                    <FontAwesomeIcon icon={faRightFromBracket} />Sign out
                </button>
            </li>
        </ul>

    </aside>
    
  )
  
}

export default Sidebar
