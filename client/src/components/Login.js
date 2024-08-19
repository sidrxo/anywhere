// src/Login.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Render the Google Sign-In button after the component mounts
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '542621242409-kjbm9dama0k1diofo2mjiefpsimthjtn.apps.googleusercontent.com',
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('buttonDiv'),
        { theme: 'outline', size: 'large' } // Customize the button
      );
      window.google.accounts.id.prompt(); // Prompt the user if necessary
    }
  }, []);

  const handleCredentialResponse = (response) => {
    console.log('Encoded JWT ID token:', response.credential);
    
    // Decode the JWT to extract user information
    const userObject = parseJwt(response.credential);
    console.log('Decoded user info:', userObject);

    // Save the user's email in a cookie
    if (userObject && userObject.email) {
      document.cookie = `user_email=${userObject.email}; path=/; max-age=3600`; // Cookie valid for 1 hour
    }

    // Send user data to the backend to store in MongoDB
    storeUserData(userObject);
  };

  const storeUserData = async (userObject) => {
    const { sub: googleId, name, email, picture } = userObject;

    try {
      const response = await fetch('http://localhost:7000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleId, name, email, picture }),
      });

      if (response.ok) {
        console.log('User data stored successfully');
        // Redirect to profile page after successful login
        navigate('/profile');
      } else {
        console.error('Failed to store user data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to decode JWT
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding JWT', e);
      return null;
    }
  };

  return (
    <div>
      <h2>Google Sign-In Button Example</h2>
      <div id="buttonDiv"></div>
    </div>
  );
}

export default Login;
