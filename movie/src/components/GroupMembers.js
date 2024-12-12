import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../components/GroupStyles.css';

const GroupMembers = ({ groupId }) => {
    const [members, setMembers] = useState([]);
    const userId = Number(localStorage.getItem('userId'));
    const isOwner = members.find(member => member.id === userId && member.isowner === true);
    useEffect(() => {
        if (groupId) {
            fetchMembers();
            console.log('members lines, ', members.lenghth)
        }
    }, [groupId,fetchMembers]);

    const fetchMembers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/members`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        
            if (response.data) {
                setMembers(response.data.members);
                console.log('member data , ', response.data)
            }
        } catch (error) {
            console.error('error geting users', error);
           
        }
    };

    const handleRemoveMember = async (groupId, memberId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.delete(`http://localhost:5000/api/groups/${groupId}/remove/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(response.data.message);
            fetchMembers();
        } catch (err) {
            alert(err.response?.data?.message || 'Error removing the member');
        }
    }

    return (
        <div>
            <h3 className="membership-heading">Group members ({members.length}):</h3>
{members.length > 0 ? (
    <ul>
        {members.map((member) => (
            <li key={member.id}>
                {member.isowner ? (
                    <>
                        {member.name} (The owner)
                    </>
                ) : (
                    <>
                        {member.name} (The member)
                        {isOwner && (
                            <button onClick={() => handleRemoveMember(groupId, member.id)}>
                                Remove
                            </button>
                        )}
                    </>
                )}
            </li>
        ))}
    </ul>
) : (
    <p>No members found.</p>
)}


        </div>
    );
};

export default GroupMembers;
