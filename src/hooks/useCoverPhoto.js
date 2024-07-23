import { useCallback, useEffect } from "react"
import useAxiosPrivate from "./useAxiosPrivate"
import useAuth from "./useAuth"

const useCoverPhoto = (name) => {
    const axiosPrivate = useAxiosPrivate()
    const {setBgCover} = useAuth()

    const getCoverPhoto = useCallback(async () => {
            try {
                const response = await axiosPrivate.get(`/coverphotos?name=${name}`)
                setBgCover(response.data);
            } catch (error) {
                console.error('Error fetching cover photo:', error.message);     
            }
    }, [name, axiosPrivate, setBgCover])

    useEffect(() => {
        if(name){
            getCoverPhoto()
        }
    }, [name, getCoverPhoto])

    return {getCoverPhoto}
}

export default useCoverPhoto