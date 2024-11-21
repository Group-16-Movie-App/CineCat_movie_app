import React, { useState, useEffect } from 'react';
import FavoritesList from '../components/FavoritesList';
import './ProfilePage.css';
import axios from 'axios';


/* This component serves as the main profile page for logged-in users.It displays user information, statistics, and their favorite movies.*/
const ProfilePage = () => {
    const [favoritesCount, setFavoritesCount] = useState(0);
    const storedUserName = localStorage.getItem('userName');
    const userName = storedUserName && storedUserName !== 'null' ? storedUserName : 'User';
    const avatarLetter = userName.charAt(0).toUpperCase();

    // Add useEffect to fetch favorites count
    useEffect(() => {
        const fetchFavoritesCount = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:5000/api/favorites', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setFavoritesCount(response.data.length);
            } catch (error) {
                console.error('Error fetching favorites count:', error);
            }
        };

        fetchFavoritesCount();

        // Set up event listener for favorites updates
        window.addEventListener('favoritesUpdated', fetchFavoritesCount);
        
        return () => {
            window.removeEventListener('favoritesUpdated', fetchFavoritesCount);
        };
    }, []);

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
                    </div>
                </div>
                
                {/* This is the user Statistics Section on ther profile page */}
                <div className="profile-stats">
                    {/* Favorites Count */}
                    <div className="stat-card">
                        <div className="stat-number">
                            {favoritesCount}
                        </div>
                        <div className="stat-label">Favorite Movies</div>
                    </div>
                    {/* Reviews Count */}
                    <div className="stat-card">
                        <div className="stat-number">5</div>
                        <div className="stat-label">Reviews</div>
                    </div>
                    {/* Groups Count */}
                    <div className="stat-card">
                        <div className="stat-number">3</div>
                        <div className="stat-label">Groups</div>
                    </div>
                </div>
            </div>

            {/* Favorites Section */}
            <div className="favorites-section">
                <h2>My Favorites</h2>
                <FavoritesList />
            </div>

            {/* Reviews Section */}
            <div className="favorites-section">
                <h2>My Reviews</h2>
                <div className="reviews-content">
                    {/* Hard-coded reviews for now */}
                    <p>Reviews...</p>
                </div>
            </div>

            {/* Groups Section */}
            <div className="favorites-section">
                <h2>My Groups</h2>
                <div className="groups-content">
                    {/* Hard-coded groups for now */}
                    <p>Groups...</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 