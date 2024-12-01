import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './GroupStyles.css';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/groups');
            setGroups(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch groups');
            setLoading(false);
        }
    };

    const handleDeleteGroup = async (e, groupId) => {
        e.preventDefault(); // Prevent navigation to group page
        e.stopPropagation(); // Prevent event bubbling

        if (!window.confirm('Are you sure you want to delete this group?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.status === 200) {
                // Remove the deleted group from state
                setGroups(groups.filter(group => group.id !== groupId));
            }
        } catch (err) {
            console.error('Error deleting group:', err);
            alert('Failed to delete group. Please try again.');
        }
    };

    if (loading) return <div className="loading">Loading groups...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="groups-page">
            <div className="groups-header">
                <h1>Movie Groups</h1>
                <Link to="/create-group" className="create-group-link">
                    + Create New Group
                </Link>
            </div>

            {groups.length === 0 ? (
                <div className="no-groups">
                    <p>No groups available. Create one to get started!</p>
                </div>
            ) : (
                <div className="groups-grid">
                    {groups.map(group => (
                        <Link to={`/group/${group._id}`} key={group._id} className="group-card-link">
                            <div className="group-card">
                                <button 
                                    className="delete-group-button"
                                    onClick={(e) => handleDeleteGroup(e, group._id)}
                                    title="Delete Group"
                                >
                                    ×
                                </button>
                                <h3 className="group-card-title">{group.name}</h3>
                                <div className="group-card-info">
                                    <p>Members: {group.members?.length || 0}</p>
                                    <p>Movies: {group.movies?.length || 0}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupList;