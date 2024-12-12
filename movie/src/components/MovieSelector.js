import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MovieSelector = ({ onSelect, onClose }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=9c371464b5857d6498e853bd22bd1f2b'); // Replace with your TMDB API key
                setMovies(response.data.results);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setError('Failed to load movies');
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) return <div>Loading movies...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="modal">
            <h3>Select a Movie</h3>
            <ul>
                {movies.map(movie => (
                    <li key={movie.id} onClick={() => onSelect(movie)}>
                        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                        <span>{movie.title}</span>
                    </li>
                ))}
            </ul>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default MovieSelector; 