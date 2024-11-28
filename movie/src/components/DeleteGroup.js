import React from 'react';
import axios from 'axios';

const DeleteGroup = ({ groupId }) => {
    const handleDeleteGroup = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to delete the group.');
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Group deleted successfully!');
        } catch (error) {
            console.error('Failed to delete group:', error);
        }
    };

    return (
        <button onClick={handleDeleteGroup}>Delete Group</button>
    );
};

export default DeleteGroup;