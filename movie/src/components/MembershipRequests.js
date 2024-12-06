import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MembershipRequests = ({ groupId }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/membership-requests`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching membership requests:', error);
            }
        };

        fetchRequests();
    }, [groupId]);

    const handleRequest = async (memberId, action) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/members/${memberId}`, { action }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh requests after handling
            setRequests((prev) => prev.filter(req => req.account_id !== memberId));
        } catch (error) {
            console.error('Error handling membership request:', error);
        }
    };

    return (
        <div>
            <h3>Membership Requests</h3>
            <ul>
                {requests.map(request => (
                    <li key={request.id}>
                        {request.email}
                        <button onClick={() => handleRequest(request.account_id, 'accept')}>Accept</button>
                        <button onClick={() => handleRequest(request.account_id, 'reject')}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MembershipRequests;