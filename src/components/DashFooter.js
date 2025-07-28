import { Link } from 'react-router-dom'
import addpatient from '../img/add-patient.png'
import patientslist from '../img/patients-list.png'
import appointment from '../img/appointment.png'
import appointmentslist from '../img/appointments-list.png'
import trackstatus from '../img/track-status.png'
import usersetting from '../img/user-settings.png'
import useAuth from '../hooks/useAuth'

const DashFooter = () => {

    const {dark} = useAuth()

    const content = (

        <footer className="dash-footer" style={{ backgroundColor: dark ? 'black' : 'aliceblue', borderTop: dark ? '0.01px solid #333333' : '0.01px solid #ccc', padding: '0.5rem 0.25rem 0.25rem', zIndex: 10}}>

               <div className='board-responsive'>

                    <Link to="/account/medicaltest">
                        <div className='board-footer-img'>
                            <div className="tooltip first-tooltip">
                                <img className='img-add' src={addpatient} alt="Healthcare" />
                                <span className="tooltiptext firstooltip">Add New Patient</span>
                            </div>
                        </div>
                    </Link>

                    <Link to="/account/patients">
                        <div className='board-footer-img'>
                            <div className="tooltip">
                                <img className='img-add' src={patientslist} alt="Healthcare" />
                                <span className="tooltiptext">Patient List</span>
                            </div>
                        </div>
                    </Link>

                    <Link to="/account/new-appointment">
                        <div className='board-footer-img'>
                            <div className="tooltip">
                                <img className='img-add' src={appointment} alt="Healthcare" />
                                <span className="tooltiptext">Reserve Appointment</span>
                            </div>
                        </div>
                    </Link>

                    <Link to="/account/appointments">
                        <div className='board-footer-img'>
                            <div className="tooltip">
                                <img className='img-add' src={appointmentslist} alt="Healthcare" />
                                <span className="tooltiptext">View All Appointments</span>
                            </div>
                        </div>
                    </Link>

                    <Link to="/account/appointmentstatus">
                        <div className='board-footer-img'>
                            <div className="tooltip">
                                <img className='img-add' src={trackstatus} alt="Healthcare" />
                                <span className="tooltiptext">Track Status</span>
                            </div>
                        </div>
                    </Link>

                    <Link to="/account/users">
                        <div className='board-footer-img'>
                            <div className="tooltip last-tooltip">
                                <img className='img-add' src={usersetting} alt="Healthcare" />
                                <span className="tooltiptext lastooltip">View User Settings</span>
                            </div>
                        </div>
                    </Link>

                </div>  

        </footer>

    )

    return content
}

export default DashFooter
