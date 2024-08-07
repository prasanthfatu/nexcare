import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect, useState, useCallback, useRef } from "react";
import moment from "moment";
import useAuth from "../../hooks/useAuth";

const SingleAppointment = () => {

    const errRef = useRef(null)
    const [errMsg, setErrMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)

    const { setAppId } = useAuth()
    const navigate = useNavigate()
    const { notId, appId } = useParams();
    
    const [appointment, setAppointment] = useState('');

    const axiosPrivate = useAxiosPrivate();

    const date = moment(appointment.startTime).format("YYYY-MM-DD");
    const timeFrom = moment(appointment.startTime).format("HH:mm");
    const timeTo = moment(appointment.endTime).format("HH:mm");

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
                {/* <p>Loading...</p> */}
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

    
    // return appointment ? <NotificationView appointment = {appointment}/> : <p>Data Not Found</p>
    return(
        <>
            <section className="single-appointment">
                <div className="content-visible">
                    <h5>New Appointment</h5>
                    <p>Patient Name: {appointment.patientName}</p>
                    <br />
                    <p>Doctor: {appointment.doctor}</p>
                    <br />
                    <p>Date: {date}</p>
                    <br />
                    <p>
                        Time: {timeFrom} - {timeTo}
                    </p>
                    <br />
                    <p>Required Test: {appointment.test}</p>
                    <br />
                    <p>Status: {appointment.status}</p>
                    <br />
                </div>
            </section>
            <div className="singlepage-permission">
                {appointment.status === "pending" && (
                    <div className="appointment-status">
                        <button onClick={handleAccept} disabled={isDisabled}>Accept</button>
                        <button onClick={handleDeny} disabled={isDisabled}>Deny</button>
                    </div>
                )}
            </div>
        </>
    );

};

export default SingleAppointment;
