import React, { useState } from 'react';
import axios from 'axios';
import MovieSelector from './MovieSelector';

const AddMovie = ({ groupId, onClose }) => {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showSelector, setShowSelector] = useState(false);

    const handleAddMovie = async () => {
        const token = localStorage.getItem('token');
        if (!selectedMovie) {
            alert('Please select a movie.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/movies`, {
                title: selectedMovie.title,
                description: selectedMovie.overview
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Movie added successfully!');
            onClose();
        } catch (error) {
            console.error('Failed to add movie:', error);
        }
    };

    return (
        <div className="modal">
            <h3>Add Movie</h3>
            <button onClick={() => setShowSelector(true)}>Select Movie</button>
            {selectedMovie && <p>Selected Movie: {selectedMovie.title}</p>}
            <button onClick={handleAddMovie}>Add Movie</button>
            <button onClick={onClose}>Cancel</button>

            {showSelector && (
                <MovieSelector 
                    onSelect={(movie) => {
                        setSelectedMovie(movie);
                        setShowSelector(false);
                    }} 
                    onClose={() => setShowSelector(false)} 
                />
            )}
        </div>
    );
};

export default AddMovie;