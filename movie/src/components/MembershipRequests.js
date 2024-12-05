import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MembershipRequests = ({ groupId }) => {
    const [requests, setRequests] = useState([]);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        fetchRequests();
        checkOwnerStatus();
    }, [groupId]);

    const checkOwnerStatus = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsOwner(response.data.isOwner);
        } catch (error) {
            console.error('Error checking owner status:', error);
        }
    };

    const fetchRequests = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/membership-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching membership requests:', error);
        }
    };

    const handleAccept = async (memberId) => {
        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/members/${memberId}/accept`);
            setRequests(requests.filter(request => request.id !== memberId));
            fetchRequests(); // Refresh the requests list
        } catch (error) {
            console.error('Error accepting member:', error);
        }
    };

    const handleReject = async (memberId) => {
        try {
            await axios.delete(`http://localhost:5000/api/groups/${groupId}/members/${memberId}/reject`);
            setRequests(requests.filter(request => request.id !== memberId));
        } catch (error) {
            console.error('Error rejecting member:', error);
        }
    };

    if (!isOwner) return null;

    return (
        <div className="section-content">
            <h3 className="section-title">Membership Requests</h3>
            {requests.length === 0 ? (
                <p className="no-requests">No pending requests</p>
            ) : (
                <ul className="requests-list">
                    {requests.map(request => (
                        <li key={request.id} className="list-item">
                            <span>{request.email}</span>
                            <div className="request-buttons">
                                <button 
                                    className="action-button accept"
                                    onClick={() => handleAccept(request.id)}
                                >
                                    Accept
                                </button>
                                <button 
                                    className="action-button reject"
                                    onClick={() => handleReject(request.id)}
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MembershipRequests;