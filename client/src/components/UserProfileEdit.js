import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useChatContext } from './ChatContext';
import { useNavigate } from 'react-router-dom';
import CustomSnackbar from './CustomSnackbar';

const UserProfileEdit = () => {
  const navigate = useNavigate()
  const { chatUser, setChatUser } = useChatContext();
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')
  const [initialValues, setInitialValues] = useState({
    name: '',
    child_name: '',
    bio: '',
    location: '',
    favorite_activities: ''
  });
  const handleSuccess = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  const handleError = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };
  useEffect(() => {
    console.log(chatUser)
    // Fetch current user data from the server or context
    // and then set it as initial form values
    setInitialValues({
      name: chatUser.userName,
      child_name: chatUser.childName,
      bio: chatUser.userBio,
      location: chatUser.userLocation,
      favorite_activities: chatUser.activities
    });
  }, [chatUser]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      // Add your validation schema here
    }),
    onSubmit: (values) => {
      // Send PUT or PATCH request to update user information
      fetch(`http://localhost:5555/user`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify(values)
      })
      .then(response => response.json())
      .then(data => {
        // Transform the data to the expected format
        const updatedChatUser = {
          ...chatUser,
          userName: data.name,
          childName: data.child_name,
          userBio: data.bio,
          userLocation: data.location,
          activities: data.favorite_activities
        };
      
        // Update the context with new user data
        setChatUser(updatedChatUser);
        handleSuccess("Profile Updated")
      })
      .catch(error => {
        handleError(`Error updating profile: ${error}`);
      });
    }
  });

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmDelete) {
      fetch(`http://localhost:5555/user`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error deleting account');
        }
        // Handle logout and redirect here
        // For instance, clear local storage and redirect to login page
        localStorage.clear();
        handleSuccess("Account Deleted")
        navigate('/');
      })
      .catch(error => {
        handleError(`Error deleting account: ${error}`);
      });
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleBackToHome = () => {
    navigate('/user_home');
  };

  return (
    <form onSubmit={formik.handleSubmit} className="profile-form">
      <input
        id="name"
        name="name"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      <input
        id="child_name"
        name="child_name"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.child_name}
      />
      <input
        id="bio"
        name="bio"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.bio}
      />
      <input
        id="location"
        name="location"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.location}
      />
      <input
        id="favorite_activities"
        name="favorite_activities"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.favorite_activities}
      />
      <button type="submit" className="update-button">Update Profile</button>
      <button type="button" onClick={handleDeleteAccount} className="delete-button">Delete Account</button>
      <button onClick={handleBackToHome} className="back-button">Back to Home</button>
      <CustomSnackbar 
        open={isSnackbarOpen} 
        handleClose={handleCloseSnackbar} 
        message={snackbarMessage} 
        severity={snackbarSeverity} 
      />
    </form>
    
  );
};

export default UserProfileEdit;
