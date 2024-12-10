import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GroupMovies = ({ groupId, onSelect }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMovies = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/movies`);
            setMovies(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setError('Failed to load movies');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [groupId]);

    if (loading) return <div>Loading movies...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div>
            <h3>Group Movies</h3>
            <ul>
                {movies.map(movie => (
                    <li key={movie.id} onClick={() => onSelect(movie.id)}>
                        {movie.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupMovies;