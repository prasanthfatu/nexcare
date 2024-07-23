import { useState } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import useAuth from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'
import useNotifyCount from "../../hooks/useNotifyCount"

const Notifications = ({ setOpenNotificationBar, refreshNotiyLength }) => {
    const {profileNotify} = useNotifyCount()

    const navigate = useNavigate()

    const { auth, notificationLen } = useAuth()
    const decode = auth?.accessToken ?
        jwtDecode(auth.accessToken)
        : undefined

    const username = decode.UserInfo.username

    const axiosPrivate = useAxiosPrivate()
    const [clickedItem, setClickedItem] = useState(null);

    const filterednotifications = notificationLen.filter(notification => {
        return notification.recipient === username
    })

    const refreshAndNavigate = (notification) => {
        setOpenNotificationBar(false)
        if(notification.newUser === 'Registered'){
            navigate(`/account/regsuccessmessage/${notification._id}`)
        }
        else if(notification.profileUpload === 'Uploaded') {
            navigate(`/account/profilesuccess/${notification._id}`)
            profileNotify()

        } else {
            navigate(`/account/singleappointment/${notification._id}/${notification.appointmentId}`)
            profileNotify()
        }

        profileNotify()
    }

    if (filterednotifications.length === 0) {
        return(
            <>
                <h4 className="notify-heading">Notifications</h4>
                <h6 className='empty-notify'>Notification is empty.</h6>
            </>
        )
    }


    function timeAgoFromCreatedAt(data) {

        // Converting the createdAt timestamp to a Date object
        const createdAtDate = new Date(data);

        // Getting the current date
        const currentDate = new Date();

        // Calculating the time difference in milliseconds
        const timeDifference = currentDate - createdAtDate;

        // Converting milliseconds to seconds, minutes, hours, and days
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        // Formatting the output based on the time difference
        if (days > 0) {
            return <p className="time-ago">{`${days} day${days === 1 ? '' : 's'} ago`}</p>;
        } else if (hours > 0) {
            return <p className="time-ago">{`${hours} hour${hours === 1 ? '' : 's'} ago`}</p>;
        } else if (minutes > 0) {
            return <p className="time-ago">{`${minutes} minute${minutes === 1 ? '' : 's'} ago`}</p>;
        } else {
            return <p className="time-ago">{`${seconds} second${seconds === 1 ? '' : 's'} ago`}</p>;
        }
    }

    const handleIconClick = (e, notificationId) => {
        // Prevent the click event from bubbling up
        e.stopPropagation();
         if (clickedItem === notificationId) {
            setClickedItem(null);
        } else {
            setClickedItem(notificationId);
        }
    }   

    const deleteNotify = async(e, notId) => {
         // Prevent the click event from bubbling up
         e.stopPropagation();
         try {
            await axiosPrivate.delete(`/notifications/${notId}`)
            profileNotify()
            refreshNotiyLength()
        } catch (err) {
            console.error(err);
        }
    }

    return (
        < div className='notify-overflow'>
            <div className="notify-large-container">
                <h4 className="notify-heading">Notifications</h4>
                <ul className="notify-message-container">
                    {filterednotifications.slice().sort((a, b) => {
                        if (a.createdAt > b.createdAt) return -1;
                        if (a.createdAt < b.createdAt) return 1;
                        return 0
                    }).map(notification => (
                        <div className="notify-list" key={notification._id}>
                            <li className={`notify-list-icon ${notification.read ? 'read' : 'unread'}`} key={notification._id} onClick={() => refreshAndNavigate(notification)}>
                                <div><strong>{notification.type}:</strong> {notification.content}</div><br />
                                <div className="notify-del-view">{timeAgoFromCreatedAt(notification.createdAt)}
                                { clickedItem === notification._id && (
                            
                            <div className="notify-del-btn">
                                <p onClick={(e) => deleteNotify(e, notification._id)}>Delete</p>
                            </div>
                            )}
                                </div>
                                <div>
                                <div className='notify-remove-icon'>
                                    <p className="notify-remove" onClick={(e) => handleIconClick(e, notification._id)}><FontAwesomeIcon icon={faEllipsis} /></p>
                                    
                                </div>
                               
                            </div>
                            </li>
                           
                        </div>
                    ))}
                </ul>
            </div>
            
        </div>
    )
}

export default Notifications
