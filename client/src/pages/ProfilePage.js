// src/ProfilePage.js

import React from 'react';
import Profile from './Profile';
import UploadsBoard from '../components/UploadsBoard'; // Import UploadsBoard
import './page-styles/ProfilePage.css'; // Optional: Add styles for ProfilePage

function ProfilePage() {
  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <Profile />
      <h2>Your Uploads</h2>
      <div className="uploads-container">
      <UploadsBoard numColumns={numColumns}  />
    </div>
    </div>
    
  );
}

export default ProfilePage;
