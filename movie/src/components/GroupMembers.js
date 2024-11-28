import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GroupMembers = ({ groupId }) => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/members`);
                setMembers(response.data);
            } catch (error) {
                console.error('Error fetching group members:', error);
            }
        };

        fetchMembers();
    }, [groupId]);

    return (
        <div>
            <h3>Group Members</h3>
            <ul>
                {members.map(member => (
                    <li key={member.id}>{member.email} - {member.role}</li>
                ))}
            </ul>
        </div>
    );
};

export default GroupMembers;