import React, { useState } from 'react';
import axios from 'axios';
import './GroupStyles.css'
import { useNavigate } from 'react-router-dom';

const CreateGroup = ({ onGroupCreated }) => {
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            setError('Group name cannot be empty');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to create a group.');
            return;
        }

        setLoading(true);
        setError('');

        setLoading(true);
        setError('');

        try {
            const groupResponse = await axios.post(
                'http://localhost:5000/api/groups', 
                { name: groupName }, 
                { 
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log('Group creation response:', groupResponse.data);
            
            const newGroupId = groupResponse.data.id;
            navigate(`/group/${newGroupId}`);
            onGroupCreated(groupResponse.data);
        } catch (err) {
            console.error('Error creating group:', err.response || err);
            setError(err.response?.data?.message || 'Failed to create group. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
       
            <div className="create-group-card">
                <h2 className="groups-heading">Create New Group</h2>
                <div className="create-group-form">
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter Group Name"
                        className="group-input"
                        disabled={loading}
                    />
                    <button 
                        onClick={handleCreateGroup}
                        className="create-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Group'}
                    </button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
   
    );
};

export default CreateGroup;