import React from 'react';
import FavoritesList from '../components/FavoritesList';
import './ProfilePage.css';

/**
 * ProfilePage Component
 * 
 * This component serves as the main profile page for logged-in users.It displays user information, statistics, and their favorite movies.*/
const ProfilePage = () => {
    // Retrieve user information from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName') || 'User';
    
    // Extract first letter of username for use in avatar display
    const avatarLetter = userName.charAt(0).toUpperCase();

    return (
        <div className="profile-container">
            {/* Profile Header Section */}
            <div className="profile-header">
                {/* User Information Display */}
                <div className="user-info">
                    {/* User Avatar - displays first letter of username */}
                    <div className="avatar">
                        {avatarLetter}
                    </div>
                    {/* User Details Section */}
                    <div className="user-details">
                        <h1>Welcome, {userName}!</h1>
                        <p>{userEmail}</p>
                    </div>
                </div>
                
                {/* This is the user Statistics Section on ther profile page */}
                <div className="profile-stats">
                    {/* Favorites Count Card */}
                    <div className="stat-card">
                        <div className="stat-number">
                            {/* This is to be made dynamic based on actual favorites, reviews and groups, but its actually hard codded at the moment till those aspects of the application are implemented  */}
                            12
                        </div>
                        <div className="stat-label">Favorite Movies</div>
                    </div>
                    {/* Reviews Count Card */}
                    <div className="stat-card">
                        <div className="stat-number">5</div>
                        <div className="stat-label">Reviews Written</div>
                    </div>
                    {/* Lists Count Card */}
                    <div className="stat-card">
                        <div className="stat-number">3</div>
                        <div className="stat-label">Lists Created</div>
                    </div>
                </div>
            </div>

            {/* Favorites Section */}
            <div className="favorites-section">
                <h2>My Favorites</h2>
                <FavoritesList />
            </div>
        </div>
    );
};

export default ProfilePage; 