import React from 'react';
import axios from 'axios';

const RemoveMember = ({ groupId, memberId }) => {
    const handleRemoveMember = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to remove members.');
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/groups/${groupId}/members/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Member removed successfully!');
        } catch (err) {
            console.error('Failed to remove member:', err);
        }
    };

    return (
        <button onClick={handleRemoveMember}>Remove Member</button>
    );
};

export default RemoveMember;