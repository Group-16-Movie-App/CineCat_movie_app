import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GroupSchedules = ({ groupId }) => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/schedules`);
                setSchedules(response.data);
            } catch (error) {
                console.error('Error fetching group schedules:', error);
            }
        };

        fetchSchedules();
    }, [groupId]);

    return (
        <div>
            <h3>Group Schedules</h3>
            <ul>
                {schedules.map(schedule => (
                    <li key={schedule.id}>
                        Movie ID: {schedule.movie_id} - Showtime: {schedule.showtime}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupSchedules;