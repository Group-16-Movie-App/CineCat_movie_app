import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GroupStyles.css';
import CreateGroup from './CreateGroup';

const GroupList = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userData = localStorage.getItem('user');
    const userId = userData ? JSON.parse(userData).id : null;

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/groups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGroups(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch groups');
            setLoading(false);
        }
    };

    const handleJoinGroup = async (groupId) => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        console.log('User Data:', userData);

        const parsedUserData = userData ? JSON.parse(userData) : null;
        const userName = parsedUserData ? parsedUserData.name : null;

        if (!userName) {
            alert('User data is not available. Please log in again.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/groups/${groupId}/join-request`, { userName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(response.data.message);
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            } else {
                alert('An unexpected error occurred.');
            }
        }
    };

    if (loading) return <div className="loading">Loading groups...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="groups-page">
            <div className="groups-header">
                <h1>Movie Groups</h1>
                <CreateGroup onGroupCreated={fetchGroups} />
            </div>

            {groups.length === 0 ? (
                <div className="no-groups">
                    <p>No groups available. Create one to get started!</p>
                </div>
            ) : (
                <div className="groups-grid">
                    {groups.map(group => (
                        <div key={group.id} className="group-card">
                            <h3 className="group-card-title">{group.name}</h3>
                            {/* Hide the Join Group button for members and the owner */}
                            {group.owner !== userId && !group.members?.some(member => member.id === userId) && (
                                <button onClick={() => handleJoinGroup(group.id)}>Join Group</button>
                            )}
                            <Link to={`/group/${group.id}`} className="group-card-link">View Group</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupList;