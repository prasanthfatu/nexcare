const TrackHead = ({dark}) => {
  return (
    <tr className='track-head'>
        <th style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}}>Test</th>
        <th style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}} className="track-date-style">Date</th>
        <th style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}} className="track-time">Time</th>
        <th style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA'}}>Status</th>
        <th style={{backgroundColor: '#121212', color: dark ? '#BBBBBB':'#EAEAEA', borderRight: 'none'}}>Delete</th>
    </tr>
  )
}

export default TrackHead
