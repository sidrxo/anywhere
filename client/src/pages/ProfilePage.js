// ProfilePage.js
import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user information from the backend or context
        // For example, from an API endpoint that provides user details
        fetch('/api/user/profile')
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => console.error('Error fetching user profile:', error));
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="profile-container">
            <h1>Welcome, {user.name}!</h1>
            <img src={user.picture} alt="Profile" />
            <p>Email: {user.email}</p>
        </div>
    );
};

export default ProfilePage;
