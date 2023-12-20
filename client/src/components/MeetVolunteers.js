
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useChatContext } from './ChatContext'
import CustomSnackbar from './CustomSnackbar'

const MeetVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const navigate = useNavigate();
    const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleError = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };
  
    useEffect(() => {
      const token = localStorage.getItem('jwt_token');
      const fetchVolunteers = async () => {
        try {
          const response = await fetch('http://localhost:5555/volunteers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
          if (!response.ok) {
            handleError('Network response was not okay!');
          }
          const data = await response.json();
          setVolunteers(data); // Set the fetched volunteers to state
        } catch (error) {
          handleError(`Error fetching Buddies: ${error}`);
        }
      };

      fetchVolunteers(); // Call the function to fetch volunteers
    }, []);
    const onCreateChatRoom = async (volunteerId) => {
      const token = localStorage.getItem('jwt_token'); // Retrieve the stored token
      try {
        const response = await fetch('http://localhost:5555/create_chat_room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          },
          body: JSON.stringify({ volunteer_id: volunteerId }),
        });
    
        if (!response.ok) {
          handleError(`HTTP error! Status: ${response.status}`);
        }
    
        const chatRoom = await response.json();
        navigate(`/chat/${chatRoom.chat_room_id}`, { state: { volunteerId: volunteerId }})
      } catch (error) {
        handleError(`Failed to create chat room: ${error}`);
        // Handle errors, such as displaying a notification to the user
      }
    };

    const handleBackToHome = () => {
      navigate('/user_home'); // Navigate to User Home page
    };

    const handleCloseSnackbar = () => {
      setSnackbarOpen(false);
    };
  
    return (
      <div>
        <button onClick={handleBackToHome}>Back to Home</button> {/* Back to Home button */}
        {volunteers.map((volunteer) => (
          <div key={volunteer.id} className="volunteer-profile">
            <h3>{volunteer.name}</h3>
            <p>Bio: {volunteer.bio}</p>
            <p>Location: {volunteer.location}</p>
            <button onClick={() => onCreateChatRoom(volunteer.id)}>Message</button>
            <CustomSnackbar 
        open={isSnackbarOpen} 
        handleClose={handleCloseSnackbar} 
        message={snackbarMessage} 
        severity={snackbarSeverity} 
      />
          </div>
        ))}
      </div>
    );
};

export default MeetVolunteers;
