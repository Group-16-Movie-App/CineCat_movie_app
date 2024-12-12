import axios from 'axios';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const PostCreationModal = ({ groupId, movie, onClose }) => {
    const token = localStorage.getItem('token');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!title || !description || !movie.id) {
                setError('Please fill in all required fields: Title, Description, and Movie');
                return;  // Exit early if required fields are missing
              }
              const groupId = 22;
              const response = await axios.post(`http://localhost:5000/api/groups/${groupId}/posts`, {
                title,
                description,
                movieId: movie.id,
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });
            console.log('Comment added:', response.data);
            setTitle('');
            setDescription('')
            alert('Post created successfully!');
            console.log('Response:', response.data);
            onClose(); // Close the modal
        } catch (err) {
            console.error('Error creating post:', err);
            setError('Failed to create the post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            color: 'black',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                width: '400px',
            }}>
                <h2>Create Post</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Post Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    </div>
                    <div>
                        <h3>Selected Movie:</h3>
                        <p><strong>{movie.title}</strong></p>
                        <p>{movie.overview}</p>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit" style={{ marginRight: '10px' }} disabled={loading}>
                        {loading ? 'Creating...' : 'Create Post'}
                    </button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

PostCreationModal.propTypes = {
    movie: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default PostCreationModal;
