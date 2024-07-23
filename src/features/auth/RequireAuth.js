import { Outlet, Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const RequireAuth = ({allowedRoles}) => {
    const {auth} = useAuth()
    const location = useLocation()

    const decode = auth?.accessToken ?
                                jwtDecode(auth.accessToken)
                                    : undefined

    const roles = decode?.UserInfo?.roles || []                                

    return(
        roles.find(role => allowedRoles.includes(role)) ?
                    <Outlet />
                        : auth.accessToken ?
                            <Navigate to='/account/unauthorized' state={{from: location}} replace />
                                    : <Navigate to='/login' state={{from: location}} replace />
    )

}

export default RequireAuth