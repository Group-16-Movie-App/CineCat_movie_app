import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './GroupStyles.css';
import CreateGroup from './CreateGroup';
import { FaTrash } from 'react-icons/fa';
import { handleLeaveGroup } from './LeaveGroup';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [myGroups, setMyGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [myGroupsCount, setMyGroupsCount] = useState(0);
    const [joinRequests, setJoinRequests] = useState([]); 

    const userId = Number(localStorage.getItem('userId'));
    const navigate = useNavigate(); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/groups');
        } else {
            fetchGroups();
            fetchGroupList();
        }
    }, [navigate]); 

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/groups', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGroups(response.data);
        } catch (err) {
            setError('Failed to fetch groups');
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupList = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/groups', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const userGroups = response.data.filter(
                (group) => group.owner === userId || group.members?.includes(userId)
            );
            setMyGroups(userGroups);
            setMyGroupsCount(userGroups.length);
        } catch (err) {
            setError('Failed to fetch user groups');
        }
    };

    const handleJoinGroup = async (groupId) => {
        const token = localStorage.getItem('token');
        const userName = localStorage.getItem('userName');  
        
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
            setJoinRequests((prev) => [...prev, groupId]); 
        } catch (error) {
            alert(error.response?.data?.message || 'An unexpected error occurred.');
        }
    };
    const handleLeaveGroup = async (groupId, userId) => {
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
            fetchGroups();
            fetchGroupList();
        } catch (error) {
            console.error('Failed to leave group:', error);
        }
    };
    const handleDeleteGroup = async (groupId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(response.data.message);
            fetchGroups();
            fetchGroupList();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting group');
        }
    };

    if (loading) return <div className="loading">Sign in to browse the groups</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="groups-page">
            <div className="groups-header">
                <h1>Movie Groups</h1>
            </div>
            <CreateGroup onGroupCreated={fetchGroups} />
            <h2>You are part of {myGroupsCount} group(s).</h2>

            {myGroups.length > 0 && (
                <div className="my-groups">
                    <h2>Your Groups</h2>
                    <div className="divider"></div>
                    <div className="groups-grid">
                        {myGroups.map((group) => (
                            <div key={group.id} className="group-card">
                                <h3 className="group-card-title">{group.name}</h3>
                                <Link to={`/group/${group.id}`} className="group-card-link">View Group</Link>
                                { (group.owner === userId || group.members?.includes(userId)) && (
                                    <button onClick={() => handleLeaveGroup(group.id)}>
                                        Leave Group
                                    </button>
                                )}
                                {group.owner === userId && (
                                    <button onClick={() => handleDeleteGroup(group.id)}>
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {groups.length > 0 && (
                <div className="all-groups">
                    <h2>All Groups</h2>
                    <div className="groups-grid">
                        {groups.map((group) => (
                            <div key={group.id} className="group-card">
                                <h3 className="group-card-title">{group.name}</h3>

                                {group.owner !== userId &&
                                    !group.members?.includes(userId) &&
                                    !joinRequests.includes(group.id) && (
                                        <button onClick={() => handleJoinGroup(group.id)}>Join Group</button>
                                    )}
              

                                {joinRequests.includes(group.id) && (
                                    <span>Request sent, waiting for approval...</span>
                                )}

                                {(group.owner === userId || group.members?.includes(userId)) ? (
                                    <Link to={`/group/${group.id}`} className="group-card-link">View Group</Link>
                                ) : (
                                    <span>You can't view this group until your request is approved</span>
                                )}
                                { (group.owner === userId || group.members?.includes(userId)) && (
                                    <button 
                                        onClick={() => {handleLeaveGroup(group.id, userId);
                                                        navigate('/groups')
                                    }}>
                                        Leave Group
                                    </button>
                                )}
                                {group.owner === userId && (
                                    <button onClick={() => {handleDeleteGroup(group.id)
                                                            navigate('/groups')
                                    }}>
                                        <FaTrash />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupList;
