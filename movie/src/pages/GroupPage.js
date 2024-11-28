import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GroupCustomization from '../components/GroupCustomization';
import GroupMembers from '../components/GroupMembers';
import MembershipRequests from '../components/MembershipRequests';
import GroupMovies from '../components/GroupMovies';
import GroupSchedules from '../components/GroupSchedules';
import DeleteGroup from '../components/DeleteGroup'; // Import the delete component
import '../components/GroupStyles.css'; // Import the styles

const GroupPage = () => {
    const { id } = useParams();
    const [group, setGroup] = useState(null);

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${id}`);
                setGroup(response.data);
            } catch (error) {
                console.error('Error fetching group:', error);
            }
        };

        fetchGroup();
    }, [id]);

    if (!group) return <div>Loading...</div>;

    return (
        <div className="group-container">
            <h2 className="group-title">{group.name}</h2>
            <p className="group-owner">Owner: {group.owner}</p>
            <GroupMembers groupId={id} />
            <MembershipRequests groupId={id} />
            <GroupCustomization groupId={id} />
            <GroupMovies groupId={id} />
            <GroupSchedules groupId={id} />
            <DeleteGroup groupId={id} />
        </div>
    );
};

export default GroupPage;