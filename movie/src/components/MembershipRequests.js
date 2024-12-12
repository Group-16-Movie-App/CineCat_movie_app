import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MembershipRequests = ({ groupId }) => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchRequests();
    }, [groupId]);
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
    const handleRequest = async (memberId, userName, action) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/members/${memberId}`, { action }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Show success alert
            if (action === 'accept') {
                alert(`Membership request from user ${userName} has been accepted.`);
            } else if (action === 'reject') {
                alert(`Membership request from user ${userName} has been rejected.`);
            }
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
                        {request.user_name} wants to join our group!
                        <button onClick={() => {handleRequest(request.account_id, request.user_name, 'accept')
                                                navigate(`/group/${groupId}`)
                                                }}>Accept</button>
                        <button onClick={() => {handleRequest(request.account_id, request.user_name, 'reject')
                                                navigate(`/group/${groupId}`)
                                                }}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MembershipRequests;