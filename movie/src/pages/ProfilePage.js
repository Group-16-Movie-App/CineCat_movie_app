import React from 'react';
import FavoritesList from '../components/FavoritesList';

const ProfilePage = () => {
    // Get user info from localStorage or context
    const userEmail = localStorage.getItem('userEmail');

    return (
        <div className="profile-container">
            <h1>My Profile</h1>
            <p>Email: {userEmail}</p>
            
            <h2>My Favorites</h2>
            <FavoritesList />
        </div>
    );
};

export default ProfilePage; 