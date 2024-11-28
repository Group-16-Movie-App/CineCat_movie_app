import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GroupMovies = ({ groupId }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/movies`);
                setMovies(response.data);
            } catch (error) {
                setError('Error fetching group movies.');
                console.error('Error fetching group movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [groupId]);

    if (loading) return <div>Loading movies...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h3>Group Movies</h3>
            <ul>
                {movies.map(movie => (
                    <li key={movie.id}>
                        {movie.title} - {movie.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupMovies;