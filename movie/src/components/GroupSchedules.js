import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupSchedules = ({ groupId }) => {
    const [schedules, setSchedules] = useState([]);
    const [movieId, setMovieId] = useState('');
    const [showtime, setShowtime] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchSchedules = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/schedules`);
            setSchedules(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching schedules');
            console.error('Error fetching schedules:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [groupId]);

    const handleAddSchedule = async () => {
        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/schedules`, {
                movieId,
                showtime
            });
            // Reset form and refresh schedules list
            setMovieId('');
            setShowtime('');
            fetchSchedules();
        } catch (error) {
            setError('Failed to add schedule');
            console.error('Error adding schedule:', error);
        }
    };

    return (
        <div className="section-content">
            <h3 className="section-title">Group Schedules</h3>
            <div className="input-container">
                <input
                    type="text"
                    value={movieId}
                    onChange={(e) => setMovieId(e.target.value)}
                    placeholder="Movie ID"
                    className="input-field"
                />
                <input
                    type="datetime-local"
                    value={showtime}
                    onChange={(e) => setShowtime(e.target.value)}
                    className="input-field"
                />
                <button 
                    onClick={handleAddSchedule}
                    className="action-button"
                >
                    Add Schedule
                </button>
            </div>

            <div className="schedules-list">
                {schedules.map(schedule => (
                    <div key={schedule.id} className="list-item">
                        <div>
                            <h4>Movie ID: {schedule.movie_id}</h4>
                            <p>Showtime: {new Date(schedule.showtime).toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupSchedules;