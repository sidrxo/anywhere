// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot instead of render
import App from './App';
import './styles.css';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider

const container = document.getElementById('root');
const root = createRoot(container); // Create a root.

const clientId = '542621242409-kjbm9dama0k1diofo2mjiefpsimthjtn.apps.googleusercontent.com'; // Replace with your Google Client ID

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
