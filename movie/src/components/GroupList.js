import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GroupList = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/groups');
                setGroups(response.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, []);

    return (
        <div>
            <h2>Groups</h2>
            <ul>
                {groups.map(group => (
                    <li key={group.id}>
                        <Link to={`/group/${group.id}`}>{group.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupList;