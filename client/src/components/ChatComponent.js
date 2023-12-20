import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from './ChatContext';

const ChatComponent = () => {
  const navigate = useNavigate()
  const { chatUser } = useChatContext ();
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            // Handle the case where there is no token
            console.log("No JWT token found");
            return;
        }

        let url = `http://localhost:5555/${chatUser.userType}_rooms`;
        console.log(chatUser)
        // if (chatUser.userType === 'user') {
        //   url += `user_rooms/`;
        // } else if (chatUser.userType === 'volunteer') {
        //   url += `volunteer_rooms/`;
        // }
        // else {
        //   alert("could not fetch rooms.")
        // }
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setChatRooms(data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    if (chatUser && chatUser.userId) {
        fetchChatRooms();
    }
}, [chatUser]);
  
const handleChatRoomSelect = (roomId, volunteerId) => {
  navigate(`/chat/${roomId}`, { state: { volunteerId: volunteerId } });
  console.log(`Room ID: ${roomId}, Volunteer ID: ${volunteerId}`)
};

const handleBackToHome = () => {
  navigate('/user_home');
};

  return (
    <div>
      <h2>Chat Rooms</h2>
      <button onClick={handleBackToHome}>Back to Home</button>
      {chatRooms.map((room) => (
        <div key={room.id} onClick={() => handleChatRoomSelect(room.id, room.user_id)} style={{ cursor: 'pointer' }}>
          Chat with {room.user_name}
        </div>
      ))}

    </div>
  );
};

export default ChatComponent;