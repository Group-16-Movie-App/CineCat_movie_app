import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Reviews from '../components/Reviews';


const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/movies/${id}`)
            .then(response => setMovie(response.data))
            .catch(error => console.error('Error fetching movie details:', error));
    }, [id]);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get('http://localhost:5000/api/favorites', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setIsFavorite(response.data.some(fav => fav.id === parseInt(id)));
            } catch (error) {
                console.error('Error checking favorite status:', error);
            }
        };

        checkFavoriteStatus();
    }, [id]);

    const toggleFavorite = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please log in to add favorites');
                return;
            }

            if (isFavorite) {
                await axios.delete(`http://localhost:5000/api/favorites/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/favorites', 
                    { movie_id: id },
                    { headers: { Authorization: `Bearer ${token}` }}
                );
            }

            setIsFavorite(!isFavorite);
            
            // dispatchEvent:this is a custom event to communicate between components
           window.dispatchEvent(new Event('favoritesUpdated'));
        } catch (error) {
            console.error('Error toggling favorite:', error);
            alert('Failed to update favorites');
        }
    };

    if (!movie) return <div>Loading...</div>;

    console.log('Movie genres ',movie.genres)

    const genreNames = movie.genres.map(genre => genre.name || "Unknown");

    return (
        <>
            <div style={{width:'100%', textAlign:'center'}}>
            <h2>{movie.title}</h2>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <p>{movie.overview}</p>
            <p>Genre: {genreNames.join(', ')}</p>
            <p>Rating: {movie.vote_average}</p>
            <p>Release Date: {movie.release_date}</p>
            <button onClick={toggleFavorite}>
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
        </div>
        <Reviews movieId={id} />
        </>
    );
};

export default MovieDetail;
