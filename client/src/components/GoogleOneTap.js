// src/components/GoogleOneTap.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleOneTap = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });

    window.google.accounts.id.prompt(); // Display the Google One Tap UI
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const result = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/google/callback`, {
        credential: response.credential,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (result.data.redirectUrl) {
        window.location.href = result.data.redirectUrl;
      }
    } catch (error) {
      console.error('Error during Google One Tap:', error);
    }
  };

  return null; // No UI component to render
};

export default GoogleOneTap;
