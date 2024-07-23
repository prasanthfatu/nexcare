import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useEffect, useState, useCallback } from "react";
import moment from "moment";
import useAuth from "../../hooks/useAuth";

const SingleAppointment = () => {

    const { setAppId } = useAuth()
    const navigate = useNavigate()
    const { notId, appId } = useParams();
    
    const [appointment, setAppointment] = useState("");

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
            const response = await axiosPrivate.get(`/appointments/${appId}`);
            setAppointment(response.data)
            setAppId(appId)
        } catch (err) {
            console.error(err);
        }
    }, [axiosPrivate, appId, setAppId])

    useEffect(() => {
        handleNotification();
        readNotification()
    }, [handleNotification, readNotification]);

    const handleAccept = async () => {
        try {
            await axiosPrivate.put(`/appointments`,
                JSON.stringify({ status: "accept", id: appId }));
            navigate('/account/appointments')
        } catch (err) {
            console.error(err);
        }

    };

    const handleDeny = async (id) => {
        try {
            await axiosPrivate.put(`/appointments`,
                JSON.stringify({ status: "deny", id: appId }));
            navigate('/account/appointments')
        } catch (err) {
            console.error(err);
        }

    };

    if(appointment.length === 0) {
        return <p>Appointment Not Found</p>
    }

    return (
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
                        <button onClick={handleAccept}>Accept</button>
                        <button onClick={handleDeny}>Deny</button>
                    </div>
                )}
            </div>
        </>
    );

};

export default SingleAppointment;
