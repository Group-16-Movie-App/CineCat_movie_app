import axios from 'axios';

export const handleLeaveGroup = async (groupId, userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to leave the group.');
        return;
    }

    try {
        await axios.delete(`http://localhost:5000/api/groups/${groupId}/members/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert('You have left the group successfully!');
    } catch (error) {
        console.error('Failed to leave group:', error);
    }
};