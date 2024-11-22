import React, { useState, useEffect } from 'react';
import FavoritesList from '../components/FavoritesList';
import './ProfilePage.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './ProfilePage.css';


/* This component serves as the main profile page for logged-in users.It displays user information, statistics, and their favorite movies.*/
const ProfilePage = () => {
    const { userId } = useParams();
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [profileData, setProfileData] = useState(null);
    const storedUserName = localStorage.getItem('userName');
    const isOwnProfile = !userId;
    
    // Update userName logic to handle shared profiles
    const userName = isOwnProfile 
        ? (storedUserName && storedUserName !== 'null' ? storedUserName : 'User')
        : (profileData?.userName || 'User');
    const avatarLetter = userName.charAt(0).toUpperCase();

    // Modified useEffect to fetch profile data
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                const endpoint = userId 
                    ? `http://localhost:5000/api/profile/${userId}`
                    : 'http://localhost:5000/api/favorites';
                
                const response = await axios.get(endpoint, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                
                if (userId) {
                    setProfileData(response.data);
                    setFavoritesCount(response.data.favorites.length);
                } else {
                    setFavoritesCount(response.data.length);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchProfileData();

        // Only add event listener for own profile
        if (isOwnProfile) {
            window.addEventListener('favoritesUpdated', fetchProfileData);
            return () => {
                window.removeEventListener('favoritesUpdated', fetchProfileData);
            };
        }
    }, [userId, isOwnProfile]);

    // Add share button component (only show on own profile)
    const ShareButton = () => {
        const handleShare = () => {
            const userId = localStorage.getItem('userId');
            const shareUrl = `${window.location.origin}/profile/${userId}`;
            navigator.clipboard.writeText(shareUrl);
            alert('Profile URL copied to clipboard!');
        };

        return isOwnProfile ? (
            <button className="share-button" onClick={handleShare}>
                Share Profile
            </button>
        ) : null;
    };

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
                        <ShareButton />
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
                    {/* I have hard-coded reviews for now */}
                    <p>Reviews...</p>
                </div>
            </div>

            {/* Groups Section */}
            <div className="favorites-section">
                <h2>My Groups</h2>
                <div className="groups-content">
                    {/* I have hard-coded groups for now */}
                    <p>Groups...</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage; 