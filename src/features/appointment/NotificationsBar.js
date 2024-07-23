import { useEffect } from "react"
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import useAuth from "../../hooks/useAuth"
import { useNavigate, useParams } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import useNotifyCount from "../../hooks/useNotifyCount"

const NotificationsBar = () => {

    const {profileNotify} = useNotifyCount()

    const navigate = useNavigate()
    const params = useParams()
    const user = params.user

    const { auth, notificationLen } = useAuth()
    const decode = auth?.accessToken ?
        jwtDecode(auth.accessToken)
        : undefined

    const username = decode.UserInfo.username

    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        profileNotify()
    }, [axiosPrivate, user, profileNotify])

    const filterednotifications = notificationLen.filter(notification => {
        return notification.recipient === username
    })

    const refreshAndNavigate = (notification) => {
        
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

    const deleteNotify = async(e, notId) => {
        // Prevent the click event from bubbling up
        e.stopPropagation();
        try {
           await axiosPrivate.delete(`/notifications/${notId}`)
           profileNotify()
       } catch (err) {
           console.error(err);
       }
   }

    if (filterednotifications.length === 0) {
        return  <h4 className="notify-heading">Notification is empty.</h4>
    }

    return (
        < div className='notify-overflow'>
            <div className="notify-bar-container">
                <h4>Notifications</h4>
                <ul>
                    {filterednotifications.slice().sort((a,b) => {
                        if(a.createdAt > b.createdAt) return -1;
                        if(a.createdAt < b.createdAt) return 1;
                        return 0;
                    }).map(notification => (
                        <div className="notify-list-bar" key={notification._id}>
                            <li className={`notify-list-icon-bar ${notification.read ? 'read' : 'unread'}`} key={notification._id} onClick={() => refreshAndNavigate(notification)}>
                                <div><strong>{notification.type}:</strong> {notification.content}</div><br />
                                <div className="notify-del-view-bar">{timeAgoFromCreatedAt(notification.createdAt)}
                                    <div className='notify-remove-icon-bar'>
                                        <p className="notify-remove-bar" onClick={(e) => deleteNotify(e, notification._id)}><FontAwesomeIcon icon={faTrash} /></p>
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

export default NotificationsBar