import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GroupMembers = ({ groupId }) => {
    const [members, setMembers] = useState([]);  

    useEffect(() => {
        const fetchMembers = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/members`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            
                if (response.data) {
                    setMembers(response.data);
                }
            } catch (error) {
                console.error('error geting users', error);
               
            }
        };

        if (groupId) {
            fetchMembers();
        }
    }, [groupId]);

    return (
        <div>
            <h3>Members of Group {groupId}</h3>
            {members.length > 0 ? (
                <ul>
                    {members.map((member) => (
                        <li key={member.id}>{member.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No members found.</p>
            )}
        </div>
    );
};

export default GroupMembers;
