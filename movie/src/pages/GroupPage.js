import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GroupMembers from '../components/GroupMembers';
import MembershipRequests from '../components/MembershipRequests';
import GroupMovies from '../components/GroupMovies';
import GroupSchedules from '../components/GroupSchedules';
import DeleteGroup from '../components/DeleteGroup';
import GroupComments from '../components/GroupComments';
import '../components/GroupStyles.css';

const GroupPage = () => {
    const { id } = useParams();
    const userData = localStorage.getItem('user');
    const userId = userData ? JSON.parse(userData).id : null;

    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        const fetchGroup = async () => {
            if (!id) {
                setError('Invalid group ID');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${id}`);
                setGroup(response.data);

                // Check if the user is a member
                const memberResponse = await axios.get(`http://localhost:5000/api/groups/${id}/members`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setIsMember(memberResponse.data.some(member => member.id === userId));
            } catch (error) {
                console.error('Error fetching group:', error);
                setError('Failed to load group');
            }
        };

        fetchGroup();
    }, [id]);

    const handleDeleteGroup = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/groups/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Group deleted successfully!');
            // Redirect or refresh the group list
        } catch (error) {
            console.error('Error deleting group:', error);
            alert('Failed to delete group.');
        }
    };

    if (error) return <div className="error-message">{error}</div>;
    if (!group) return <div>Loading...</div>;

    return (
        <div className="group-container">
            <h2 className="group-title">{group.name}</h2>
            <p className="group-owner">Owner: {group.owner_name || 'Unknown'}</p>
            <div className="group-layout">
                <div className="group-sidebar">
                    <GroupMembers groupId={id} />
                    <MembershipRequests groupId={id} />
                </div>
                <div className="group-main-content">
                    <GroupMovies groupId={id} />
                    <GroupSchedules groupId={id} />
                    {isMember ? (
                        <GroupComments groupId={id} userId={userId} />
                    ) : (
                        <p>You must be a member to view comments.</p>
                    )}
                </div>
            </div>
            {group.owner === userId && (
                <button onClick={handleDeleteGroup}>Delete Group</button>
            )}
        </div>
    );
};

export default GroupPage;