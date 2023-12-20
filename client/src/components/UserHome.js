// import { useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from './ChatContext'

const UserHome = () => {
  const navigate = useNavigate();
  const { chatUser, setChatUser } = useChatContext()
  console.log(chatUser)

  const handleMeetVolunteersClick = () => {
    navigate('/meet_volunteers');
  };

  const handleChatComponentClick = () => {
    navigate('/chats');
  };

  const handleEditProfileClick = () => {
    navigate('/user_edit_profile');
  };

  const handleLogout = () => {
    // Remove the JWT token (or other authentication token) from local storage
    localStorage.removeItem('jwt_token'); // Adjust the key if different
    localStorage.removeItem('chatUser')
    setChatUser(null)
    // Navigate the user to the home page or login page
    navigate('/');
  };

  return (
    <div className="user-home">
      <h1>Welcome, {chatUser.userName}</h1>
      <div>
        <h2>Profile Details:</h2>
        <p><strong>Child's Name:</strong> {chatUser.childName}</p>
        <p><strong>Bio:</strong> {chatUser.userBio}</p>
        <p><strong>Favorite Activities:</strong> {chatUser.activities}</p>
        <p><strong>Location:</strong> {chatUser.userLocation}</p>
      </div>
      <button onClick={handleMeetVolunteersClick}>Meet Buddies</button>
      <button onClick={handleChatComponentClick}>Messages</button>
      <button onClick={handleEditProfileClick}>Edit Profile</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserHome;