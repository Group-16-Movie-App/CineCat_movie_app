import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MembershipRequests from '../components/MembershipRequests';
import GroupMembers from '../components/GroupMembers';
import Posts from '../components/Posts';
import SearchMovieForPost from '../components/SearchMovieForPost';
import { handleLeaveGroup } from '../components/LeaveGroup';
import { handleDeleteGroup } from '../components/DeleteGroup';
import '../components/GroupStyles.css';

const GroupPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const userId = Number(localStorage.getItem('userId'));
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const [isMember, setIsMember] = useState(false);
    const [showWritePost, setShowWritePost] = useState(false);

    useEffect(() => {
        const fetchGroup = async () => {
            if (!id) {
                setError('Invalid group ID');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${id}`);
                const groupData = response.data;

                setGroup(groupData);

                const memberResponse = await axios.get(`http://localhost:5000/api/groups/${id}/members`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                const members = memberResponse.data.members;
                if (Array.isArray(members)) {
                    setIsMember(members.some(member => member.id === userId));
                } else {
                    console.error('Unexpected data format for members:', memberResponse.data);
                    setIsMember(false);
                }
            } catch (error) {
                console.error('Error fetching group:', error);
                setError('Failed to load group');
            }
        };

        fetchGroup();
    }, [id, userId]);

    if (error) return <div className="error-message">{error}</div>;
    if (!group) return <div>Loading...</div>;

    return (
        <div className="group-container">
            <h2 className="group-title">{group.name}</h2>
            <p className="group-owner">Owner: {group.owner_name}</p>
            <div className="group-layout">
                <div className="group-sidebar">
                    <MembershipRequests groupId={id} />
                    <GroupMembers groupId={id} />
                </div>
                <div className="group-main-content">
                    <div className="options-container" >
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '300px'}}>
                        <button
                            className={`option-button ${!showWritePost ? 'active' : ''}`}
                            onClick={() => setShowWritePost(false)}
                        >
                            Group Posts
                        </button>
                        <button
                            className={`option-button ${showWritePost ? 'active' : ''}`}
                            onClick={() => setShowWritePost(true)}
                        >
                            Write A Post
                        </button>
                        </div>
                    </div>
                    <div className="content-container">
                        {!showWritePost ? (
                            <Posts groupId={id} />
                        ) : (
                            <div className="write-post-container">
                                <h3>Write a New Post</h3>
                                <SearchMovieForPost groupId={id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '300px'}}>
                {isMember ? (
                    <button
                        className="delete-group-button"
                        onClick={() => { handleLeaveGroup(group.id, userId); navigate('/groups'); }}
                    >
                        Leave Group
                    </button>
                ) : (
                    <button disabled>Not a member</button>
                )}

                {group.owner === userId && (
                    <button
                        className="delete-group-button"
                        onClick={() => { handleDeleteGroup(group.id); navigate('/groups'); }}
                    >
                        Delete Group
                    </button>
                )}
            </div>
        </div>
    );
};

export default GroupPage;
