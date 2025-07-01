import healthplus from '.././img/health-plus.png'
import circles from '.././img/circles.png'
import doctorvisit from '.././img/doctor-visit.png'
import health from '.././img/healt.png'
import medicalteam from '.././img/medical-team.png'
import family from '.././img/family.png'
import useAuth from '../hooks/useAuth'

const Page = () => {

  const { dark } = useAuth()

  return (

    <div className='page'>

      <img className='health-plus-img' src={healthplus} alt="Healthcare" style={{backgroundColor: dark ? 'gray' : 'transparent'}} />

      <h1>
        Our medical test content undergoes rigorous review by <span className='page-wordone'>expert professionals</span> and is continuously updated to <span className='page-wordtwo'>ensure accuracy</span> and <span className='page-wordthree'>reliability</span> for our users <span className='page-wordfour'>peace of mind.</span></h1>

      <h4 style={{color: dark ? '#EAEAEA' : 'rgb(41, 40, 40)'}}>Laboratory Testing</h4>

      <div className='page-grid'>

        <div className='page-container' style={{border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}>
          <img src={doctorvisit} alt="Healthcare" />
          <p style={{color: dark ? '#BBBBBB' : 'black', border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}>Comprehensive panels to assess various health indicators including cholesterol levels, blood sugar levels, liver function, kidney function, and more.</p>
        </div>

        <div className="page-container" style={{border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}>
          <img src={health} alt="Healthcare" />
          <p style={{color: dark ? '#BBBBBB' : 'black', border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}> Screening for urinary tract infections, kidney disorders, and metabolic abnormalities.</p>
        </div>

        <div className="page-container" style={{border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}>
          <img src={medicalteam} alt="Healthcare" />
          <p style={{color: dark ? '#BBBBBB' : 'black', border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}>Assessment of genetic predispositions to certain diseases and conditions.</p>
        </div>

        <div className="page-container" style={{border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}>
          <img src={family} alt="Healthcare" />
          <p style={{color: dark ? '#BBBBBB' : 'black', border: dark ? '0.01px solid #333333' : '0.01px solid #ccc'}}>Screening for common infections such as HIV, hepatitis, STDs, and respiratory infections.</p>
        </div>

      </div>

    </div>

  )
  
}

export default Page


