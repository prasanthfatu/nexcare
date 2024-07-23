import { useEffect, useCallback } from "react";
import useAuth from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";

const useProfile = (name, auth) => {
    const { setProfile } = useAuth()
    const axiosPrivate = useAxiosPrivate()

    const getProfile = useCallback(async() => {
        try {
          const response = await axiosPrivate.get(`/profile?name=${name}`, {
            headers: {
              'Authorization': `Bearer ${auth?.accessToken}`,
            }
          })
          setProfile(response.data);
        } catch (error) {
          console.error(error);
        }
      }, [name, auth, axiosPrivate, setProfile])

      useEffect(() => {
        if(name && auth?.accessToken){
            getProfile()
        }
    }, [name, auth, getProfile])

  return { getProfile }
}

export default useProfile
