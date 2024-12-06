import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './GroupComments.css'; // Import your CSS file

const GroupComments = ({ groupId, userId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replies, setReplies] = useState({});
    const [likeCounts, setLikeCounts] = useState({}); // State for like counts
    const [likedComments, setLikedComments] = useState({}); // Track liked comments

    const fetchComments = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/comments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(response.data);
            // Initialize like counts
            const initialLikeCounts = {};
            response.data.forEach(comment => {
                initialLikeCounts[comment.id] = comment.likes || 0; // Assuming likes are part of the comment data
            });
            setLikeCounts(initialLikeCounts); // Set the initial like counts
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
            console.log('Comment added:', response.data);
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleLikeComment = async (commentId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(`http://localhost:5000/api/groups/${groupId}/comments/${commentId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Like response:', response.data); // Log the response
            // Update liked comments state
            setLikedComments((prev) => ({
                ...prev,
                [commentId]: !prev[commentId] // Toggle the liked state
            }));
            // Fetch updated like count
            fetchUpdatedLikes(commentId);
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const fetchUpdatedLikes = async (commentId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/comments/${commentId}/likes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update the like count in the UI
            setLikeCounts((prev) => ({
                ...prev,
                [commentId]: response.data.likes // Assuming the response contains the updated like count
            }));
        } catch (error) {
            console.error('Error fetching updated likes:', error);
        }
    };

    const handleReplyComment = (commentId) => {
        const replyText = prompt('Enter your reply:');
        if (replyText) {
            console.log(`Reply to comment ${commentId}: ${replyText}`);
            setReplies((prev) => ({
                ...prev,
                [commentId]: [...(prev[commentId] || []), replyText]
            }));
        }
    };

    useEffect(() => {
        fetchComments();
    }, [groupId]);

    console.log('Liked Comments:', likedComments);
    console.log('Like Counts:', likeCounts);

    return (
        <div className="comments-container">
            <h3>Comments</h3>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id} className="comment-item">
                        <p>{comment.text}</p>
                        <div className="comment-actions">
                            <button onClick={() => handleLikeComment(comment.id)}>
                                <FontAwesomeIcon 
                                    icon={faThumbsUp} 
                                    className="like-icon"
                                    style={{ color: likedComments[comment.id] ? 'blue' : 'gray' }} // Change color based on like state
                                />
                            </button>
                            <span>{likeCounts[comment.id] || 0} Likes</span> {/* Display like count */}
                            <button onClick={() => handleReplyComment(comment.id)}>Reply</button>
                            {replies[comment.id] && replies[comment.id].length > 0 && (
                                <ul>
                                    {replies[comment.id].map((reply, index) => (
                                        <li key={index}>{reply}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </li>
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