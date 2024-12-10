import axios from 'axios';

export const handleDeleteGroup = async (groupId) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        alert(response.data.message);
    } catch (err) {
        alert(err.response?.data?.message || 'Error deleting group');
    }
};