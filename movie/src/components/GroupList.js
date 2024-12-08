import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './GroupStyles.css';
import CreateGroup from './CreateGroup';
import { FaTrash } from 'react-icons/fa';

const GroupList = () => {
  
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userId = Number(localStorage.getItem('userId')); 

    console.log("Extracted userId:", userId);  

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/groups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Groups fetched:", response.data);  
            setGroups(response.data);
        } catch (err) {
            setError('Failed to fetch groups');
            console.error("Error fetching groups:", err); 
        } finally {
            setLoading(false);
        }
    };


    const handleJoinGroup = async (groupId) => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const parsedUserData = userData ? JSON.parse(userData) : null;
        const userName = parsedUserData ? parsedUserData.name : null;

        if (!userName) {
            alert('User data is not available. Please log in again.');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:5000/api/groups/${groupId}/join-request`,
                { userName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message || 'An unexpected error occurred.');
        }
    };

    const handleDeleteGroup = async (groupId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(response.data.message);
            fetchGroups();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting group');
            console.error("Error deleting group:", err); 
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
                    {groups.map(group => {
                        console.log("Group owner:", group.owner, "User ID:", userId);  
                        return (
                            <div key={group.id} className="group-card">
                                <h3 className="group-card-title">{group.name}</h3>
                                
                                {group.owner !== userId && !group.members?.some(member => member.id === userId) && (
                                    <button onClick={() => handleJoinGroup(group.id)}>Join Group</button>
                                )}
                                <Link to={`/group/${group.id}`} className="group-card-link">View Group</Link>
                              
                                {group.owner === userId && (
                                      <button 
            onClick={() => handleDeleteGroup(group.id)} 
           
        >
            <FaTrash />
           
        </button>

)}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GroupList;
