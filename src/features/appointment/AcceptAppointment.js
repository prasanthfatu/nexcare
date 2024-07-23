import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AcceptAppointment = async({id}) => {
    const axiosPrivate = useAxiosPrivate()
    try {
        const response = await axiosPrivate.put('/appointments', { appointmentId: id });
        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export default AcceptAppointment
