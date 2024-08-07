import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useState, useEffect, useRef, useCallback } from 'react';
import useAuth from '../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from "@fortawesome/free-solid-svg-icons"
import useProfile from '../../hooks/useProfile';
import useNotifyCount from '../../hooks/useNotifyCount'
import useCoverPhoto from '../../hooks/useCoverPhoto';
import twitter from '../../img/twitterx.png'
import instagram from '../../img/instagram.png'
import github from '../../img/github.png'
import facebook from '../../img/facebook.png'

const Profile = () => {
  
  const { auth, profile, setProfile, bgCover } = useAuth()

  const decode = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined
  const name = decode?.UserInfo?.username || ''
  const roles = decode?.UserInfo?.roles || ''

  const {profileNotify} = useNotifyCount()

  const {getCoverPhoto} = useCoverPhoto(name)

  const URL = 'http://localhost:3500/img/'
  const COVER_PHOTO_URL = 'http://localhost:3500/coverPhoto/'

  const axiosPrivate = useAxiosPrivate()

  const { getProfile } = useProfile(name, auth)

  const profileRef = useRef()

  const [selectedFile, setSelectedFile] = useState(null);
  const selectedFileRef = useRef(null)

  const [openProfileBtn, setOpenProfileBtn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [proLoading, setProLoading] = useState(false)
  const [coverImgLoading, setCoverImgLoading] = useState(false)

  const [coverPhotoImg, setCoverPhotoImg] = useState(null)

  useEffect(() => {
    const timer = setTimeout(()=> {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleProfile = useCallback(async () => {    
    if (!selectedFile) return;
    const image = new FormData();
    image.append('avatar', selectedFile);
    image.append('name', name);

    try {
      setProLoading(true)
      await axiosPrivate.post(`/profile?name=${name}`, image, {
        headers: {
          'Authorization': `Bearer ${auth?.accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSelectedFile(null)
      selectedFileRef.current.value = null
      getProfile()
      profileNotify()
      setProLoading(false)
    } catch (err) {
      console.error(err)
    } finally {
      setProLoading(false)
    }
  }, [selectedFile, axiosPrivate, auth?.accessToken, name, getProfile, profileNotify])

  const handleCoverPhoto = useCallback(async() => {
    if(!coverPhotoImg) return;
    const coverPhoto = new FormData()
    coverPhoto.append('cover', coverPhotoImg)
    coverPhoto.append('name', name)

    try {
        setCoverImgLoading(true)
        await axiosPrivate.post(`/coverphotos?name=${name}`, coverPhoto, {
          headers: {
            'Authorization': `Bearer ${auth?.accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        setCoverPhotoImg(null)
        getCoverPhoto()
        setCoverImgLoading(false)
    } catch (err) {        
        console.error(err)
    } finally {
      setCoverImgLoading(false)
    }
  }, [axiosPrivate, coverPhotoImg, auth?.accessToken, getCoverPhoto, name])

  useEffect(() => {
    getCoverPhoto()
    if(coverPhotoImg){
      handleCoverPhoto()
    }
  }, [coverPhotoImg, getCoverPhoto, handleCoverPhoto])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  useEffect(() => {
    const handleProfileBtn = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfileBtn(false)
      }
    }
    document.addEventListener('mousedown', handleProfileBtn)

    return () => document.removeEventListener('mousedown', handleProfileBtn)
  }, [])

  useEffect(() => {
    if (selectedFile) {
      setOpenProfileBtn(false)
      handleProfile();
    }
  }, [selectedFile, handleProfile]);

  const handleCoverImage = (event) => {
    setCoverPhotoImg(event.target.files[0])
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const removeProfile = async (profileId, name) => {
    setOpenProfileBtn(false)
    try {
      await axiosPrivate.delete(`/profile`, {
        params: {
          profileId: profileId,
          name: name
        }
      })
      setSelectedFile(null)
      selectedFileRef.current.value = null
      setProfile(null)
      getProfile()
    } catch (error) {
      console.error('Error removing profile:', error);
    }
  }

  if(loading) {
    return(
      <>
          <div className={`data-loading ${loading ? 'active' : 'inactive'}`}></div>
      </>
    )
  }
  
  return (

    <div className='profile-detail-info'>

      <div className='profile-page'>
 
        <div className='background-cover-container'>

          <div className='bg-img-container'>
          {
            bgCover?.coverPhoto ? (
              <img src={`${COVER_PHOTO_URL}${bgCover.name}/${bgCover.coverPhoto}`} className='bgcover-photo' alt='coverphoto' />
            ) : (
              <div className='bgcover-photo'></div>
            )
          }
          <div className = {`background-image ${coverImgLoading ? 'active' : 'inactive'}`}></div>
          </div>

          <input type='file' name='cover' id='bg-image' className='cover-photo' onChange={handleCoverImage} />
          <label htmlFor='bg-image' className='cover-photo-icon'><FontAwesomeIcon icon={faPen} /></label>

        </div>
        
        <div className='profile-container'>

          <div className='profile-img-container'>
            {profile?.image ? (
              <div>
                <img src={`${URL}${profile.name}/${profile.image}`} className='profile-picture' alt='Profile-profile' />
              </div>  
            ) : (
              <div className='profile-picture-err'></div>
            )  
            }
            <div className={`profile-loading ${proLoading ? 'active' : 'inactive'}`}></div>
          </div>  

          <div className='user-info-container'>
            <div className='user-info-name'>{name}</div>
            <div className='user-info-role'>{roles}</div>
          </div>  

          <div ref={profileRef}>
            <div>
              <input type="file" name='avatar' id='image' className='input-file' onChange={handleFileChange} ref={selectedFileRef} />
              <label className='select-image' onClick={() => setOpenProfileBtn(!openProfileBtn)}>
                <FontAwesomeIcon icon={faPen} className='edit-pen' />
              </label><br />
            </div>
            <div className='profile-action'>
              <div className={`profile-btn ${openProfileBtn ? 'active' : 'inactive'}`}>
                <div className='upload'><label htmlFor='image' className='upload' onClick={() => setOpenProfileBtn(false)}>Upload</label></div>
                <div className='remove' onClick={() => removeProfile(profile._id, name) }>Remove</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div className='user-info'>

        <div className='user-info-about'>About</div>

        <div className='user-info-para'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus maxime, aut repudiandae enim qui deleniti, nisi veritatis, a minus impedit nihil itaque reiciendis. Inventore quibusdam nobis doloremque laudantium totam non.
        Architecto, nostrum. Laboriosam aliquam ad reiciendis sapiente natus consequatur suscipit nulla dignissimos nihil inventore tempora, totam illum delectus voluptas? Aliquam asperiores assumenda quia placeat error id alias quaerat sed earum.
        </div>

        <div className='user-info-social'>
          <div className='user-info-social-logo'><img src={github} alt='github' /></div>
          <div className='user-info-social-logo'><img src={twitter} alt='twitter' /></div>
          <div className='user-info-social-logo'><img src={facebook} alt='facebook' /></div>
          <div className='user-info-social-logo'><img src={instagram} alt='instagram' /></div>
        </div>

      </div>

  </div>  
  );
}


export default Profile
