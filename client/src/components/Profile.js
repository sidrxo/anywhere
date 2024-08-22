import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UploadsBoard from './UploadsBoard'; // Import UploadsBoard

import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate for programmatic navigation

axios.defaults.baseURL = `${process.env.REACT_APP_API_BASE_URL}`;
axios.defaults.withCredentials = true; // Ensure cookies are included in requests

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track errors
    const navigate = useNavigate(); // Hook for programmatic navigation

    useEffect(() => {
        // Fetch user data from backend
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`) // Adjust path based on your backend route
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setError('You are not logged in.');
                setLoading(false);
            });
    }, []);

    const handleLogout = () => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/logout`)
            .then(() => {
                // Clear user state and redirect after logout
                setUser(null);
                setError('You have been logged out.');
                navigate('/login'); // Redirect to login page
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    if (loading) return <p>Loading...</p>; // Show loading message while fetching data

    return (
        <div>
            <h1>Profile</h1>
            {error ? (
                <div>
                    <p>{error}</p>
                    <Link to="/login">Login</Link> {/* Provide a link to the login page */}
                </div>
            ) : (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                    <div className="uploads-container">
      <UploadsBoard numColumns={3}  />
    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
