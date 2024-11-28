import React, { useState } from 'react';
import axios from 'axios';

const AddSchedule = ({ groupId }) => {
    const [scheduleData, setScheduleData] = useState({ movieId: '', showtime: '' });

    const handleAddSchedule = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to add a schedule.');
            return;
        }

        try {
            // Include groupId in the API request
            await axios.post(`http://localhost:5000/api/groups/${groupId}/schedules`, scheduleData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Schedule added successfully!');
            setScheduleData({ movieId: '', showtime: '' }); // Reset form
        } catch (error) {
            console.error('Failed to add schedule:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Movie ID"
                value={scheduleData.movieId}
                onChange={(e) => setScheduleData({ ...scheduleData, movieId: e.target.value })}
            />
            <input
                type="text"
                placeholder="Showtime"
                value={scheduleData.showtime}
                onChange={(e) => setScheduleData({ ...scheduleData, showtime: e.target.value })}
            />
            <button onClick={handleAddSchedule}>Add Schedule</button>
        </div>
    );
};

export default AddSchedule;