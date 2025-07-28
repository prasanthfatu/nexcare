import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect, useState, useCallback, useRef } from "react";
import useAuth from "../../hooks/useAuth";

const SingleAppointment = () => {

    const errRef = useRef(null)
    const [errMsg, setErrMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)

    const { setAppId, dark } = useAuth()
    const navigate = useNavigate()
    const { notId, appId } = useParams();
    
    const [appointment, setAppointment] = useState('');

    const axiosPrivate = useAxiosPrivate();

    const readNotification = useCallback(async () => {
        try {
            await axiosPrivate.put(`/notifications/${notId}`)
        } catch (err) {
            console.error(err);
        }
    }, [axiosPrivate, notId])

    const handleNotification = useCallback(async () => {
        try {
            setLoading(true)
            const response = await axiosPrivate.get(`/appointments/${appId}`);
            setAppointment(response.data)            
            setAppId(appId)
            setLoading(false)
        } catch (err) {
            console.error(err);
            if (!err.response) {
                setErrMsg('Server Unreachable');
            } else {
                setErrMsg(err.data?.message || 'Error Fetching data from server.');
            }
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }, [axiosPrivate, appId, setAppId])

    useEffect(() => {
        handleNotification();
        readNotification()
    }, [handleNotification, readNotification]);

    useEffect(() => {
        if (errMsg) {
            errRef.current?.focus();
        }
    }, [errMsg]);

    const handleAccept = async () => {
        try {
            setIsDisabled(true)
            setLoading(true)
            await axiosPrivate.put(`/appointments`,
                JSON.stringify({ status: "accept", id: appId }));
            navigate('/account/appointments')
        } catch (err) {
            console.error(err);
            if (!err.response) {
                setErrMsg('Server Unreachable');
            } else {
                setErrMsg(err.data?.message || 'Error Fetching data from server.');
            }
            setLoading(false)
            setIsDisabled(false)
        } finally {
            setLoading(false)
            setIsDisabled(false)
        }

    };

    const handleDeny = async (id) => {
        try {
            setIsDisabled(true)
            setLoading(true)
            await axiosPrivate.put(`/appointments`,
                JSON.stringify({ status: "deny", id: appId }));
            navigate('/account/appointments')
        } catch (err) {
            console.error(err);
            if (!err.response) {
                setErrMsg('Server Unreachable');
            } else {
                setErrMsg(err.data?.message || 'Error Fetching data from server.');
            }
            setLoading(false)
            setIsDisabled(false)
        } finally {
            setLoading(false)
            setIsDisabled(false)
        }

    };

    const errClass = errMsg ? "errmsg" : "offscreen"

    if(loading){
        return(
            <>
                <p style={{color: dark ? '#EAEAEA' : 'black'}}>Loading...</p>
                <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>
            </>
        )
    }

    if (errMsg) {
        return (
            <section>
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>
            </section>
        )
    }

        return(
        <>
            <section className="single-appointment" style={{zIndex: 2, border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}>
                <div className="content-visible">
                    <h5>New Appointment</h5>
                    <p style={{color: dark ? '#777777' : 'black'}}>Patient Name: {appointment.patientName}</p>
                    <br />
                    <p style={{color: dark ? '#777777' : 'black'}}>Doctor: {appointment.doctor}</p>
                    <br />
                    <p style={{color: dark ? '#777777' : 'black'}}>Date: {appointment.date}</p>
                    <br />
                    <p style={{color: dark ? '#777777' : 'black'}}>
                        Time: {appointment.time}
                    </p>
                    <br />
                    <p style={{color: dark ? '#777777' : 'black'}}>Required Test: {appointment.test}</p>
                    <br />
                    <p style={{color: dark ? '#777777' : 'black'}}>Status: {appointment.status}</p>
                    <br />
                </div>
            </section>
            <div className="singlepage-permission" style={{marginBottom: '5rem'}}>
                {appointment.status === "pending" && (
                    <div className="appointment-status">
                        <button onClick={handleAccept} disabled={isDisabled} style={{border: 'none'}}>Accept</button>
                        <button onClick={handleDeny} disabled={isDisabled} style={{border: 'none'}}>Deny</button>
                    </div>
                )}
            </div>
        </>
    );

};

export default SingleAppointment;
