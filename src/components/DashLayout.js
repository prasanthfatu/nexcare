import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'
import useAuth from '../hooks/useAuth'

const DashLayout = () => {
    const {dark} = useAuth()
    return (
        <>
            <DashHeader />
            <div className="dash-container" style={{backgroundColor: dark ? 'black' : 'aliceblue'}}>
                <Outlet />
            </div>
            <DashFooter />
        </>
    )
}
export default DashLayout