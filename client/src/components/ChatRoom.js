import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate} from 'react-router-dom';
import io from 'socket.io-client';
import { useChatContext } from './ChatContext'
import CustomSnackbar from './CustomSnackbar'



const ChatRoom = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const volunteerId = location.state?.volunteerId;
  const { chatUser } = useChatContext ();
  // const userId = location.state?.userId;
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('')
  const { chatRoomId } = useParams();;
  const socketRef = useRef(null)

  const handleError = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };

  useEffect(() => {
    // Initialize the socket inside useEffect
    socketRef.current = io('http://localhost:5555', {
      query: { token: localStorage.getItem('jwt_token') },
      transports: ['websocket'] // Force WebSocket transport
    });

    // Function to set up socket event listeners
    const setupSocketListeners = () => {
      socketRef.current.on('new_message', (newMessageData) => {
        const newMessage = newMessageData.message ? { content: newMessageData.message } : newMessageData;
        setMessages(prevMessages => [...prevMessages, newMessage]);
    });
    }

    if (chatRoomId) {
      // Emit event to join the room
      socketRef.current.emit('join_room', { chat_room_id: chatRoomId });

      setupSocketListeners();

      const fetchMessages = async () => {
        try {
          const response = await fetch(`http://localhost:5555/chat_rooms/${chatRoomId}/messages`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
            },
          });
          if (!response.ok) {
            handleError('Network response was not okay!');
          }
          const messages = await response.json();
          setMessages(messages);
        } catch (error) {
          handleError(`Error fetching messages: ${error}`);
        }
      };

      fetchMessages();
    }

    return () => {
      socketRef.current.off('new_message');
      socketRef.current.emit('leave_room', { chat_room_id: chatRoomId });
      socketRef.current.disconnect();
    };
  }, [chatRoomId]) 
  // const { currentVolunteerId } = useChatContext()
  const sendMessage = () => {
    // console.log(chatRoomId)
    // console.log(volunteerId)
    if (messageInput.trim()) {
        // Emitting the message event with necessary data
        socketRef.current.emit('send_message', { 
        chat_room_id: chatRoomId, 
        message: messageInput,
        // user_id: userId,
        volunteer_id: volunteerId,
        sender_type: chatUser.userType
      });
      setMessageInput('');
    }
  };

  const renderMessage = (msg) => {
    const isSentByCurrentUser = msg.sender_type === chatUser.userType
    console.log(msg.sender_type, chatUser.userType)
    const messageClass = isSentByCurrentUser ? 'sent' : 'received';

    return (
        <div key={msg.id} className={`message ${messageClass}`}>
            <p>{msg.content}</p>
        </div>
    );
};

const handleCloseSnackbar = () => {
  setSnackbarOpen(false);
};


const handleBackToHome = () => {
  navigate('/user_home');
};
  return (
    <div>
      <h3>Chat Room</h3>
      <button onClick={handleBackToHome}>Back to Home</button>
      <div className="messages-container">
          {messages.map(renderMessage)}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <CustomSnackbar 
        open={isSnackbarOpen} 
        handleClose={handleCloseSnackbar} 
        message={snackbarMessage} 
        severity={snackbarSeverity} 
      />
    </div>
  );
};

export default ChatRoom;