// src/Profile.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const email = getCookie('user_email');
    
    if (!email) {
      // If email is not present in cookies, set logged-in state to false
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }
    
    // Fetch user data from the backend using the email
    fetchUserData(email);
  }, []);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`http://localhost:7000/users?email=${email}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div>
        <p>You are not logged in.</p>
        <button onClick={handleLoginRedirect}>Go to Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Profile</h2>
      {userData ? (
        <div>
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
}

export default Profile;
