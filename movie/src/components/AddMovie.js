import React, { useState } from 'react';
import axios from 'axios';

const AddMovie = ({ groupId }) => {
    const [movieData, setMovieData] = useState({ title: '', description: '' });

    const handleAddMovie = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to add a movie.');
            return;
        }

        try {
            // Include groupId in the API request
            await axios.post(`http://localhost:5000/api/groups/${groupId}/movies`, movieData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Movie added successfully!');
            setMovieData({ title: '', description: '' }); // Reset form
        } catch (error) {
            console.error('Failed to add movie:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Movie Title"
                value={movieData.title}
                onChange={(e) => setMovieData({ ...movieData, title: e.target.value })}
            />
            <textarea
                placeholder="Movie Description"
                value={movieData.description}
                onChange={(e) => setMovieData({ ...movieData, description: e.target.value })}
            />
            <button onClick={handleAddMovie}>Add Movie</button>
        </div>
    );
};

export default AddMovie;