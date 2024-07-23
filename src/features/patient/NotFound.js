import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <>
    <div className='arrow-not-found'>
          <Link to='/account'><FontAwesomeIcon icon={faArrowLeft} /></Link>
      </div>
    <div className="not-found">
      <h5>404 - Page Not Found</h5>
      <p>The page you are looking for does not exist.</p>
    </div>
  </>  
  );
};

export default NotFound;
