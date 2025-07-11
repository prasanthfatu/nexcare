import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import useAuth from '../../hooks/useAuth'

const About = () => {

  const { dark } = useAuth()

   return (
      <div style={{position: 'relative'}}>

      <div
         style={{backgroundColor: 'rgba(0, 0, 0, 0.7)', position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, width: '100dvw', height: '100dvh', zIndex: -1}}
      />

      <div className="visit-link">
        <Link to='/'><FontAwesomeIcon icon={faArrowLeft} style={{color: dark ? "black" : 'whitesmoke'}} /></Link>
      </div>

      <section className='choose' style={{backgroundColor: dark ? '#121212' : 'whitesmoke'}}>
        
        <div className='choose-container'>

          <h1>About Us</h1>

          <p>At NexCare Innovate, we are committed to providing high-quality healthcare services. Our team of skilled professionals is dedicated to ensuring you receive the best possible care in a compassionate and welcoming environment.</p>

          <p>The establishment of a comprehensive medical test center represents a significant opportunity to address the growing demand for high-quality diagnostic testing services in our community. By offering a wide range of tests, advanced technology, and patient-centered care, we aim to make a positive impact on the health and well-being of individuals and contribute to the advancement of healthcare delivery.</p>

          <p>
            At Nexcare Innovate, we are dedicated to providing comprehensive medical testing services to meet the diverse healthcare needs of our patients. With state-of-the-art technology, experienced medical professionals, and a commitment to excellence, we strive to deliver accurate, reliable, and timely test results to support informed decision-making and promote overall well-being.
          </p>

        </div>
      </section>
      </div>
  )

}

export default About
