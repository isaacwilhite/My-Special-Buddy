import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useChatContext } from './ChatContext';
import { useNavigate } from 'react-router-dom';
import CustomSnackbar from './CustomSnackbar'

const UserSignup = () => {
  const { setChatUser } = useChatContext();
  const navigate = useNavigate();
  const [isSnackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')
  const handleError = (message) => {
    setSnackbarMessage(message);
    setSnackbarSeverity('error');
    setSnackbarOpen(true);
  };
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      child_name: '',
      bio: '',
      location: '',
      favorite_activities: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
            .email('Invalid email address')
            .required('Required')
            .test('checkDupEmail', 'Email already in use', function(value) {
                return new Promise((resolve, reject) => {
                    fetch(`/api/check-email?email=${value}`)
                        .then(response => {
                            if (response.status === 200) {
                                resolve(true);  // Email is not in use
                            } else {
                                resolve(false) // Email is in use
                            }
                        })
                        .catch(() => resolve(false));
                });
            }),
      password: Yup.string().required('Required').min(5, 'Password is too short'),
      name: Yup.string().required('Required'),
      child_name: Yup.string().required('Required'),
      bio: Yup.string().required('Required'),
      location: Yup.string().required('Required'),
      favorite_activities: Yup.string().required('Required')
    }),
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      fetch('http://localhost:5555/signup/user', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(data => {
            throw new Error(data.Error || 'Signup failed');
          });
        }
        return response.json();
      })
      .then(() => {
        // Continue with the login process as the signup was successful
        return fetch('http://localhost:5555/login/user', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email, password: values.password })
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('jwt_token', data.token);
        setChatUser({ userType: 'user', userId: data.user.id, userName: data.user.name, userBio: data.user.bio, userLocation: data.user.location, childName: data.user.child_name, activities: data.user.favorite_activities })
        navigate('/user_home')
      })
      .catch(error => {
        // Handle specific or general errors
        console.error("Error:", error.message);
        if (error.message === 'Email already in use') {
          handleError('This email is already in use');
        } else {
          // Handle other errors, maybe set a global form error
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
    }})
    const handleCloseSnackbar = () => {
      setSnackbarOpen(false);
    };
  return (
    <div className="signup-form-container">
    <form onSubmit={formik.handleSubmit} className="signup-form">
    <h1 className='modaltitle'>Sign Up</h1>
        <h3 className='modaltag'>Please enter the following.</h3>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        value={formik.values.email}
        placeholder="Enter Email"
      />
      <input
        id="password"
        name="password"
        type="password"
        onChange={formik.handleChange}
        value={formik.values.password}
        placeholder="Enter Password"
      />
      <input
        id="name"
        name="name"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.name}
        placeholder="Enter Your Name"
      />
      <input
        id="child_name"
        name="child_name"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.childName}
        placeholder="Enter Child's Name"
      />
      <input
        id="bio"
        name="bio"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.bio}
        placeholder="Enter Bio"
      />
      <input
        id="location"
        name="location"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.location}
        placeholder="Enter Location"
      />
      <input
        id="favorite_activities"
        name="favorite_activities"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.favoriteActivities}
        placeholder="Enter Favorite Activities"
      />
      <button type="submit" disabled={formik.isSubmitting}>Sign Up</button>
      <button className='modalbutton' onClick={() => navigate('/')}>Cancel</button>
      <CustomSnackbar 
        open={isSnackbarOpen} 
        handleClose={handleCloseSnackbar} 
        message={snackbarMessage} 
        severity={snackbarSeverity} 
      />
    </form>
    </div>
  );
};

export default UserSignup;