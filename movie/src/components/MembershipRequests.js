import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GroupStyles.css'; // Import the styles

const MembershipRequests = ({ groupId }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/membership-requests`);
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching membership requests:', error);
            }
        };

        fetchRequests();
    }, [groupId]);

    const handleAccept = async (memberId) => {
        try {
            await axios.post(`http://localhost:5000/api/groups/${groupId}/members/${memberId}/accept`);
            setRequests(requests.filter(request => request.id !== memberId));
            alert('Member accepted successfully!');
        } catch (error) {
            console.error('Error accepting member:', error);
        }
    };

    const handleReject = async (memberId) => {
        try {
            await axios.delete(`http://localhost:5000/api/groups/${groupId}/members/${memberId}/reject`);
            setRequests(requests.filter(request => request.id !== memberId));
            alert('Member rejected successfully!');
        } catch (error) {
            console.error('Error rejecting member:', error);
        }
    };

    return (
        <div className="group-section">
            <h3>Membership Requests</h3>
            <ul>
                {requests.map(request => (
                    <li key={request.id}>
                        {request.email}
                        <button className="button" onClick={() => handleAccept(request.id)}>Accept</button>
                        <button className="button" onClick={() => handleReject(request.id)}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MembershipRequests;