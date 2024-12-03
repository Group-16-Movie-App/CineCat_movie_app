import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const GroupMembers = ({ groupId }) => {
    const [members, setMembers] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [error, setError] = useState('');

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:5000/api/groups/${groupId}/members`,
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setMembers(response.data);
            
            const currentUserEmail = JSON.parse(localStorage.getItem('user')).email;
            const isUserMember = response.data.some(member => member.email === currentUserEmail);
            setIsMember(isUserMember);
        } catch (error) {
            console.error('Error fetching group members:', error);
        }
    };

    const checkMembershipStatus = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get(
                `http://localhost:5000/api/groups/${groupId}/membership-status`,
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setIsMember(response.data.isMember);
        } catch (error) {
            console.error('Error checking membership status:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        setIsLoggedIn(true);
        fetchMembers();
        checkMembershipStatus();
    }, [groupId]);

    const handleJoinRequest = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to join a group');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/join-request`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Join request sent successfully!');
        } catch (error) {
            setError('Failed to send join request');
            console.error('Error sending join request:', error);
        }
    };

    return (
        <div className="section-content">
            <h3 className="section-title">Group Members</h3>
            <ul className="members-list">
                {members.map(member => (
                    <li key={member.id} className="list-item">
                        {member.email} - {member.role}
                    </li>
                ))}
            </ul>
            
            {isLoggedIn && !isMember && (
                <button 
                    onClick={handleJoinRequest}
                    className="action-button"
                >
                    Request to Join Group
                </button>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default GroupMembers;