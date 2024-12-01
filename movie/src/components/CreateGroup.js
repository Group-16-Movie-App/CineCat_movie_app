import React, { useState } from 'react';
import axios from 'axios';
import './GroupStyles.css';

const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');

    const handleCreateGroup = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to create a group.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/groups', { name: groupName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Group created successfully!');
            setGroupName('');
        } catch (err) {
            setError('Failed to create group. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="create-group-container">
            <div className="create-group-card">
                <h2 className="create-group-title">Create New Group</h2>
                <div className="create-group-form">
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter Group Name"
                        className="group-input"
                    />
                    <button 
                        onClick={handleCreateGroup}
                        className="create-group-button"
                    >
                        Create Group
                    </button>
                </div>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default CreateGroup;
