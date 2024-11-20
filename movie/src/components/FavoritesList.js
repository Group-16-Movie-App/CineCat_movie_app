import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FavoritesList = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch favorites when component mounts
    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Fetch favorites from our API
            const response = await axios.get('http://localhost:5000/api/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setFavorites(response.data);
        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError('Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (movieId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/favorites/${movieId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Update state to remove the movie
            setFavorites(favorites.filter(movie => movie.id !== movieId));
        } catch (err) {
            console.error('Error removing favorite:', err);
            setError('Failed to remove favorite');
        }
    };

    if (loading) return <div>Loading favorites...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="favorites-grid">
            {favorites.map(movie => (
                <div key={movie.id} className="favorite-item">
                    <Link to={`/movie/${movie.id}`}>
                        <img 
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <h3>{movie.title}</h3>
                    </Link>
                    <button onClick={() => removeFavorite(movie.id)}>
                        Remove from Favorites
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FavoritesList; 