// src/ProfilePage.js

import React from 'react';
import Profile from '../components/Profile';
import UploadsBoard from '../components/UploadsBoard'; // Import UploadsBoard
import './page-styles/ProfilePage.css'; // Optional: Add styles for ProfilePage

function ProfilePage() {
  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <Profile />
      <h2>Your Uploads</h2>
      <div className="uploads-container">
      <UploadsBoard numColumns={7}  />
    </div>
    </div>
    
  );
}

export default ProfilePage;
