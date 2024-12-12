import React, { useEffect, useState } from 'react';
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
            console.error('Error fetching schedules:', error);
            setError('Failed to load schedules');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [groupId]);

    const handleAddSchedule = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/schedules`, {
                movieId,
                showtime
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMovieId('');
            setShowtime('');
            // Refresh the schedule list
            fetchSchedules();
        } catch (error) {
            setError('Failed to add schedule');
            console.error('Error adding schedule:', error);
        }
    };

    if (loading) return <div>Loading schedules...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div>
            <h3>Group Schedules</h3>
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
                <button onClick={handleAddSchedule} className="action-button">Add Schedule</button>
            </div>
            <ul>
                {schedules.map(schedule => (
                    <li key={schedule.id}>{schedule.showtime}</li>
                ))}
            </ul>
        </div>
    );
};

export default GroupSchedules;