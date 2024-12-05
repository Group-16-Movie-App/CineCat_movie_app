import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GroupComments = ({ groupId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/comments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to add a comment');
            return;
        }

        try {
           const response = await axios.post(`http://localhost:5000/api/groups/${groupId}/comments`, { text: newComment }, {
                headers: { Authorization: `Bearer ${token}` }
             });
             console.log('comment added:', response.data); 
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [groupId]);

    return (
        <div>
            <h3>Comments</h3>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>{comment.text}</li>
                ))}
            </ul>
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
            />
            <button onClick={handleAddComment}>Submit</button>
        </div>
    );
};

export default GroupComments; 