
const Unseen = ({notifications}) => {

  const res = notifications.unseenNotification.map(notification => {
    return <p>{notification.type}</p>
  })
   
  return (
    <>
    <p>{res}</p>
    </>
  )
}

export default Unseen
