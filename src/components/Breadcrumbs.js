import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function Breadcrumbs({pathname}) {
    const {dark} = useAuth()
    const breadcrumpsPath = pathname.split('/').filter(Boolean)
    const paths = breadcrumpsPath.filter(val => val !== 'account')

  return (
    <nav>
        <Link to='/account' style={{ margin: '10px 0', fontSize: '14px', color: dark ? '#EAEAEA' : 'black' }}>Home</Link>
        {
            paths.map((path, i) => {
                const route = '/account/' + paths.slice(0, i+1).join('/')
                const isLast = i === paths.length - 1
                let label = decodeURIComponent(path)

                return ( isLast || paths.length === 1 )  ?

                    <span key={path} style={{ margin: '10px 0', fontSize: '14px', color: dark ? '#EAEAEA' : 'black' }}> / {label}</span> 

                        : <span key={path} style={{ margin: '10px 0', fontSize: '14px', color: dark ? '#EAEAEA' : 'black' }}> / <Link to={route} style={{color: dark ? '#EAEAEA' : 'black'}}>{label}</Link> </span>
            })
        }
    </nav>
  )

}

export default Breadcrumbs