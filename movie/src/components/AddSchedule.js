import React, { useState } from 'react';
import axios from 'axios';
import MovieSelector from './MovieSelector'; // Import the MovieSelector component

const AddSchedule = ({ groupId, onClose }) => {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showSelector, setShowSelector] = useState(false);
    const [showtime, setShowtime] = useState('');

    const handleAddSchedule = async () => {
        const token = localStorage.getItem('token');
        if (!selectedMovie || !showtime) {
            alert('Please select a movie and enter a showtime.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/schedules`, {
                movieId: selectedMovie.id,
                showtime
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Schedule added successfully!');
            onClose(); // Close the modal
        } catch (error) {
            console.error('Failed to add schedule:', error);
        }
    };

    return (
        <div className="modal">
            <h3>Add Schedule</h3>
            <button onClick={() => setShowSelector(true)}>Select Movie</button>
            {selectedMovie && <p>Selected Movie: {selectedMovie.title}</p>}
            <input
                type="datetime-local"
                value={showtime}
                onChange={(e) => setShowtime(e.target.value)}
            />
            <button onClick={handleAddSchedule}>Add Schedule</button>
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

export default AddSchedule;