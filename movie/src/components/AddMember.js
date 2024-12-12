import React, { useState } from 'react';
import axios from 'axios';

const AddMember = ({ groupId }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleAddMember = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to add members.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/members`, { email }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Member added successfully!');
            setEmail('');
        } catch (err) {
            setError('Failed to add member. Please try again.');
            console.error(err);
        }
    };

    return (
        <div>
            <h3>Add Member</h3>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Member Email"
            />
            <button onClick={handleAddMember}>Add</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default AddMember;