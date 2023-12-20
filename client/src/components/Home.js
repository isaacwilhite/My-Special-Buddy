import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className='modal'>
      <h1 className='modalhome'>Welcome to My Special Buddy!</h1>
      <h3 className='modaltag'>Please select an option:</h3>
      <div id='loginButtons'>
        <button className='modalbutton' onClick={() => navigate('/user_login')}>User Login</button>
        <button className='modalbutton' onClick={() => navigate('/user_signup')}>User Sign Up</button>
        <button className='modalbutton' onClick={() => navigate('/volunteer_login')}>Buddy Login</button>
        <button className='modalbutton' onClick={() => navigate('/volunteer_signup')}>I want to be a Buddy!</button>
      </div>
    </div>
  )
}

export default Home;