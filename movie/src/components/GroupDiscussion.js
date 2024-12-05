import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GroupDiscussion.css';

const GroupDiscussion = ({ group, onClose }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // Fetch comments whenever the group changes
    useEffect(() => {
        fetchComments();
    }, [group]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${group.id}/comments`);
            setComments(response.data);
            console.log(response);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to comment.');
            return;
        }

        try {
            await axios.post(`http://localhost:5000/api/groups/${group.id}/comments`, 
                { text: newComment }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewComment(''); // Clear the input
            fetchComments(); // Refresh comments after adding a new one
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="discussion-container">
            <h2>Discussion for {group.name}</h2>
            <button onClick={onClose}>Close Discussion</button>
            <div className="comments-section">
                {comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <p>{comment.text}</p>
                    </div>
                ))}
            </div>
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment here..."
            />
            <button onClick={handleAddComment}>Add Comment</button>
        </div>
    );
};

export default GroupDiscussion;
