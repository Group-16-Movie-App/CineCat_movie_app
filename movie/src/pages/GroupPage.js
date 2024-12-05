import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GroupMembers from '../components/GroupMembers';
import MembershipRequests from '../components/MembershipRequests';
import GroupMovies from '../components/GroupMovies';
import GroupSchedules from '../components/GroupSchedules';
import DeleteGroup from '../components/DeleteGroup';
import '../components/GroupStyles.css';

const GroupPage = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroup = async () => {
            if (!id) {
                setError('Invalid group ID');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${id}`);
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
            <p className="group-owner">Owner: {group.owner_name}</p>
            
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
                </div>
            </div>
        </div>
    );
};

export default GroupPage;