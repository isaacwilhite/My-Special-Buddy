import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useChatContext } from './ChatContext';
import CustomSnackbar from './CustomSnackbar'


const VolunteerSignup = () => {
  const navigate = useNavigate();
  const { setChatUser } = useChatContext();
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
      bio: '',
      location: ''
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
      bio: Yup.string().required('Required'),
      location: Yup.string().required('Required')
    }),
    onSubmit: (values, { setSubmitting }) => {
      fetch('http://localhost:5555/signup/volunteer', {
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
        return fetch('http://localhost:5555/login/volunteer', {
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
        setChatUser({ userType: 'volunteer', userId: data.volunteer.id, userName: data.volunteer.name, userBio: data.volunteer.bio, userLocation: data.volunteer.location })
        navigate('/volunteer_home')
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
    <form onSubmit={formik.handleSubmit}>
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
      <button type="submit">Sign Up</button>
      <CustomSnackbar 
        open={isSnackbarOpen} 
        handleClose={handleCloseSnackbar} 
        message={snackbarMessage} 
        severity={snackbarSeverity} 
      />
    </form>
  );
};

export default VolunteerSignup;
