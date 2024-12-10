import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Schedules from './Schedules';


const AddSchedule = ({ groupId, onClose }) => {
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/schedules`);
                setSchedules(response.data);
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };

        fetchSchedules();
    }, [groupId]);

    const handleAddSchedule = async () => {
        const token = localStorage.getItem('token');
        if (!selectedSchedule) {
            alert('Please select a schedule.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/schedules`, {
                movieId: selectedSchedule.movieId,
                showtime: selectedSchedule.showtime
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Schedule added successfully!');
            onClose();
        } catch (error) {
            console.error('Failed to add schedule:', error);
        }
    };

    return (
        <div className="modal">
            <h3>Select a Schedule</h3>
            <Schedules schedules={schedules} onSelect={setSelectedSchedule} />
            {selectedSchedule && <p>Selected Schedule: {selectedSchedule.title}</p>}
            <button onClick={handleAddSchedule}>Add Schedule</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default AddSchedule;