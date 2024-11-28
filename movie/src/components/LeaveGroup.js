import React from 'react';
import axios from 'axios';

const LeaveGroup = ({ groupId, memberId }) => {
    const handleLeaveGroup = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to leave the group.');
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/groups/${groupId}/members/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('You have left the group successfully!');
        } catch (error) {
            console.error('Failed to leave group:', error);
        }
    };

    return (
        <button onClick={handleLeaveGroup}>Leave Group</button>
    );
};

export default LeaveGroup;