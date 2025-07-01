import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const UsersList = ({users}) => {

  const {dark} = useAuth()

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
              <td style={{color: dark ? '#777777' : 'black'}}>{username}</td>
              <td style={{color: dark ? '#777777' : 'black'}}>{roles.toString().replaceAll(',', ', ')}</td>
              <td>
                  <Link to={`/account/users/${_id}`}><FontAwesomeIcon icon={faPenToSquare} style={{color: dark ? '#777777' : 'black'}} /></Link>
              </td>
            </tr>
          )
        }) 
      }
    </>         
  )
}

export default UsersList
