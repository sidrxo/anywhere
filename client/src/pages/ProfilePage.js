// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login'); // Redirect to login if not authenticated
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-page">
      <h2>Welcome, {user.displayName}</h2>
      <p>Email: {user.email}</p>
      <a href="/logout">Logout</a>
    </div>
  );
};

export default ProfilePage;
