import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login';
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import About from './features/auth/About';
import Register from './features/auth/Register';
import RequireAuth from './features/auth/RequireAuth';
import Users from './features/user/Users';
import PersistLogin from './persist/PersistLogin';
import ROLES from './config/roles'
import Unauthorized from './components/Unauthorized';
import TestForm from './features/patient/TestForm';
import Patients from './features/patient/Patients';
import SinglePatientPage from './features/patient/SinglePatientPage';
import NotFound from './features/patient/NotFound';
import EditPatientForm from './features/patient/EditPatientForm';
import SingleUserPage from './features/user/SingleUserPage';
import EditUser from './features/user/EditUser';
import RegSuccess from './features/auth/RegSuccess';
import AddAppointment from './features/appointment/AddAppointment';
import AppointmentSuccess from './features/appointment/AppointmentSuccess';
import Appointments from './features/appointment/Appointments';
import SingleAppointment from './features/appointment/SingleAppointment';
import Visit from './components/Visit';
import ChooseUs from './components/ChooseUs';
import NotificationsBar from './features/appointment/NotificationsBar'
import RegSuccessMessage from './features/auth/RegSuccessMessage';
import Profile from './features/auth/Profile';
import ProfileSuccess from './features/auth/ProfileSuccess'
import useTitle from './hooks/useTitle';
import Signout from './features/auth/Signout'

function App() {

  useTitle('Nexcare')

  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='about' element={<About />} />
        <Route path='regsuccess' element={<RegSuccess />} />
        <Route path='visit-our-medicalcenter' element={<Visit />} />
        <Route path='health-care' element={<ChooseUs />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>

            <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>

                <Route path="account" element={<DashLayout />}>

                  <Route index element={<Welcome />} />

                  <Route path='medicaltest' element={<TestForm />}/>
                  <Route path='new-appointment' element={<AddAppointment />} />
                  <Route path='appointmentsuccess' element={<AppointmentSuccess />} />
                  <Route path='notifications-bar' element={<NotificationsBar />} />
                  <Route path='singleappointment/:notId/:appId' element={<SingleAppointment />} />
                  <Route path='regsuccessmessage/:notId' element={<RegSuccessMessage />} />
                  <Route path='profilesuccess/:notId' element={<ProfileSuccess />} />
                  <Route path='unauthorized' element={<Unauthorized />} />
                  <Route path='my-profile' element={<Profile />} />
                  <Route path='signout' element={<Signout />} />

                  <Route element={<RequireAuth allowedRoles={[ROLES.HealthcareProvider]} />}>
                    <Route path='appointments'>
                      <Route index element={<Appointments />} />
                    </Route>
                  </Route>

                  <Route path='patients'>
                    <Route index element={<Patients />} />
                    <Route path=':patientId' element={<SinglePatientPage />} />
                    <Route path='edit/:patientId' element={<EditPatientForm />} />
                  </Route>

                    <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>

                    <Route path='users'>
                      <Route index element={<Users />} />
                      <Route path=':userId' element={<SingleUserPage />} />
                      <Route path='edit/:userId' element={<EditUser />} />
                    </Route>
                    
                  </Route>

                </Route>
            </Route>

        </Route>    
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
