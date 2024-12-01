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