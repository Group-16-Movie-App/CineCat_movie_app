import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GroupStyles.css';

const GroupList = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/groups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Fetch member counts for each group
            const groupsWithCounts = await Promise.all(response.data.map(async (group) => {
                const membersResponse = await axios.get(
                    `http://localhost:5000/api/groups/${group.id}/members`,
                    { headers: { Authorization: `Bearer ${token}` }}
                );
                return {
                    ...group,
                    members: membersResponse.data
                };
            }));
            
            setGroups(groupsWithCounts);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch groups');
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setIsAuthenticated(true);
        fetchGroups();
    }, [navigate]);

    const handleDeleteGroup = async (e, groupId) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchGroups(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    if (!isAuthenticated) return null;
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
                        <Link to={`/group/${group.id}`} key={group.id} className="group-card-link">
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