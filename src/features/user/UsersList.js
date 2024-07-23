import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

const UsersList = ({users}) => {

  const userses = users.sort((a, b) => {
    const roleA = a.roles[0]
    const roleB = b.roles[0]
    return roleA.localeCompare(roleB)
  })

  return (
    <>
      {
        userses.map((user) => {
          const {username, roles, _id} = user
          return (
            <tr key={_id}>
              <td>{username}</td>
              <td>{roles.toString().replaceAll(',', ', ')}</td>
              <td>
                  <Link to={`/account/users/${_id}`}><FontAwesomeIcon icon={faPenToSquare} /></Link>
              </td>
            </tr>
          )
        }) 
      }
    </>         
  )
}

export default UsersList
