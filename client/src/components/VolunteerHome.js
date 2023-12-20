import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useChatContext } from './ChatContext'
const VolunteerHome = () => {
  const navigate = useNavigate();
  const { chatUser, clearChatUser } = useChatContext()
  const handleChatComponentClick = () => {
    navigate('/chats');
  };
  const handleProfileEditClick = () => {
    navigate('/volunteer_edit_profile');
  };

  const handleLogout = () => {
    // Remove the JWT token (or other authentication token) from local storage
    localStorage.removeItem('jwt_token'); // Adjust the key if different
    clearChatUser()
    // Navigate the user to the home page or login page
    navigate('/');
  };

  console.log(chatUser)

  return (
    <div className="volunteer-home">
      <h1>Welcome, {chatUser.userName}</h1>
      <div>
        <h2>Profile Details:</h2>
        <p><strong>Bio:</strong> {chatUser.userBio}</p>
        <p><strong>Location:</strong> {chatUser.userLocation}</p>
      </div>
      <button onClick={handleChatComponentClick}>Messages</button>
      <button onClick={handleProfileEditClick}>Edit Profile</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default VolunteerHome