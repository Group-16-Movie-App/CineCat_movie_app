import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './FavoritesList.css';

const SharedFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userId } = useParams();

    useEffect(() => {
        const fetchSharedFavorites = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/profile/favorites/${userId}`);
                setFavorites(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching shared favorites:', err);
                setError('Failed to load favorites');
                setLoading(false);
            }
        };

        fetchSharedFavorites();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="favorites-container">
            <h2>{favorites.length > 0 ? "Shared Favorites" : "No favorites to display"}</h2>
            <div className="favorites-grid">
                {favorites.map(movie => (
                    <div key={movie.id} className="favorite-item">
                        <img 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <div className="favorite-content">
                            <h3>{movie.title}</h3>
                            <p>{movie.release_date?.split('-')[0]}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SharedFavorites; 