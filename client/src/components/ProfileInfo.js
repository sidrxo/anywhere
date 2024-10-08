import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/component-styles/Profile.css'; // Import the CSS file for styling

axios.defaults.baseURL = `${process.env.REACT_APP_API_BASE_URL}`;
axios.defaults.withCredentials = true; // Ensure cookies are included in requests

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/user`)
            .then(response => {
                setUser(response.data);
                setLoading(false);
            })
            .catch(() => {
                navigate('/login');
            });
    }, [navigate]);

    const handleLogout = () => {
        // Start fade-out transition
        document.body.classList.add('fade-out');
        
        setTimeout(() => {
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/logout`)
                .then(() => {
                    setUser(null);
                    navigate('/home');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error logging out:', error);
                });
        }, 500); // Delay to match the CSS transition duration
    };

    if (loading) return <p>Loading...</p>;

    return (
            <div className="profile-details">
                <p> {user.name}</p>
                <p> {user.email}</p>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
    );
};

export default Profile;
