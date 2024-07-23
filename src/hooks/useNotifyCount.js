import { useEffect, useCallback } from "react"
import useAuth from "../hooks/useAuth"
import useAxiosPrivate from "./useAxiosPrivate";

const useNotifyCount = () => {
    const {setNotificationLen} = useAuth()    
    const axiosPrivate = useAxiosPrivate()

        const profileNotify = useCallback(async () => {
            try {
                const response = await axiosPrivate.get(`/notifications`);
                setNotificationLen(response.data);
            } catch (err) {
                console.error('Error fetching notification count:', err);
            }
        }, [axiosPrivate, setNotificationLen])

        useEffect(()=> {
            profileNotify()
        },[profileNotify])

    return {profileNotify};
};

export default useNotifyCount;
