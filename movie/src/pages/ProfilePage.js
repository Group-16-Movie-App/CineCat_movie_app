import React from 'react';
import FavoritesList from '../components/FavoritesList';

// This component serves as the user's profile page
// It displays user information and their favorite movies
const ProfilePage = () => {
    // Get user information from browser storage
    const userEmail = localStorage.getItem('userEmail');

    return (
        <div className="profile-container">
            {/* Display user information */}
            <h1>My Profile</h1>
            <p>Email: {userEmail}</p>
            
            {/* Display user's favorite movies */}
            <h2>My Favorites</h2>
            <FavoritesList />
        </div>
    );
};

export default ProfilePage; 