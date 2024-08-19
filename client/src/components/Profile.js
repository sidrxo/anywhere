// src/Profile.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './component-styles/Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const uniqueIdentifier = getCookie('user_id');
    
    if (!uniqueIdentifier) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }
    
    fetchUserData(uniqueIdentifier);
  }, []);

  const fetchUserData = async (uniqueIdentifier) => {
    try {
      const response = await fetch(`http://localhost:7000/users?id=${uniqueIdentifier}`);
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

  const handleLogout = () => {
    // Clear the cookie and navigate to login page
    document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    navigate('/login');
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div className="profile-container">
        <p>You are not logged in.</p>
        <button onClick={handleLoginRedirect}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Profile Page</h2>
      {userData ? (
        <div className="profile-info">
          <p>Name: {userData.name}</p>
          <p>Email: {userData.email}</p>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
}

export default Profile;
