import React from 'react';
import Profile from '../components/ProfileInfo';
import UploadsBoard from '../components/UploadsBoard'; // Import UploadsBoard
import { useDarkMode } from '../context/DarkModeContext'; // Import dark mode context
import './page-styles/ProfilePage.css'; // Optional: Add styles for ProfilePage

function ProfilePage() {
  const { isDarkMode } = useDarkMode(); // Use dark mode context

  return (
    <div className={`profile-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <h1>Profile</h1>
      <Profile />
      <h2>Uploads</h2>
      <div className="uploads-container">
        <UploadsBoard />
      </div>
    </div>
  );
}

export default ProfilePage;
