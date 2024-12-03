import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteGroup = ({ groupId }) => {
    const navigate = useNavigate();
    const [isOwner, setIsOwner] = useState(false);

    const checkOwnerStatus = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsOwner(response.data.isOwner);
        } catch (error) {
            console.error('Error checking owner status:', error);
        }
    };

    useEffect(() => {
        checkOwnerStatus();
    }, [groupId]);

    const handleDeleteGroup = async () => {
        if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to delete a group');
            return;
        }

        try {
            await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/groups');
        } catch (error) {
            console.error('Error deleting group:', error);
            alert('Failed to delete group. Please try again.');
        }
    };

    if (!isOwner) return null;

    return (
        <button 
            onClick={handleDeleteGroup}
            className="delete-group-button"
        >
            Delete Group
        </button>
    );
};

export default DeleteGroup;