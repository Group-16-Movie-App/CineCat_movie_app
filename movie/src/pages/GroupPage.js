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

    console.log('User ID:', userId);
    console.log('Group ID:', { id });
    
    useEffect(() => {
        const fetchGroup = async () => {
            if (!id) {
                setError('Invalid group ID');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${id}`);
                console.log('Group data:', response.data);
                setGroup(response.data);
            } catch (error) {
                console.error('Error fetching group:', error);
                setError('Failed to load group');
            }
        };

        fetchGroup();
    }, [id]);

    if (error) return <div className="error-message">{error}</div>;
    if (!group) return <div>Loading...</div>;

    return (
        <div className="group-container">
            <h2 className="group-title">{group.name}</h2>
            <p className="group-owner">Owner: {group.owner_name || 'Unknown'}</p>
            
            <div className="group-layout">
                <div className="group-sidebar">
                    <div className="sidebar-section">
                        <GroupMembers groupId={id} />
                        <MembershipRequests groupId={id} />
                    </div>
                    <DeleteGroup groupId={id} />
                </div>
                
                <div className="group-main-content">
                    <div className="content-section">
                        <GroupMovies groupId={id} />
                    </div>
                    <div className="content-section">
                        <GroupSchedules groupId={id} />
                    </div>
                    <GroupComments groupId={id} userId={userId} />
                </div>
            </div>
        </div>
    );
};

export default GroupPage;