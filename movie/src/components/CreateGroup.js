import React, { useState } from 'react';
import axios from 'axios';

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
        <div>
            <h2>Create Group</h2>
            <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group Name"
            />
            <button onClick={handleCreateGroup}>Create</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default CreateGroup;