import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Posts.css'; 

const Posts = ({ groupId }) => {
    const userId = Number(localStorage.getItem('userId'));
    const [posts, setPosts] = useState([]);
    const [group, setGroup] = useState({})
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${groupId}/posts`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Fetch movie details for posts with movie_id
                const postsWithMovieDetails = await Promise.all(
                    response.data.posts.map(async (post) => {
                        if (post.movie_id) {
                            try {
                                const movieResponse = await axios.get(`http://localhost:5000/api/movies/${post.movie_id}`);
                                return { ...post, movieDetails: movieResponse.data };
                            } catch (err) {
                                console.error(`Failed to fetch movie details for movie_id: ${post.movie_id}`, err);
                                return post; // Return post without movie details if error occurs
                            }
                        }
                        return post;
                    })
                );

                setPosts(postsWithMovieDetails);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Failed to fetch posts');
            }
        };
        fetchGroup()
        fetchPosts();
    }, [groupId]);

    const fetchGroup = async () => {
        if (!groupId) {
            setError('Invalid group ID');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
            const groupData = response.data;

            console.log('Group info:', groupData); 

            setGroup({ groupData });
        } catch (error) {
            console.error('Error fetching group:', error);
            setError('Failed to load group');
        }
    };

    const deleteAPost = async (postId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/groups/${groupId}/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Remove the deleted post from the local state
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (err) {
            console.error('Error deleting post:', err);
            alert('Failed to delete the post. Please try again.');
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="posts-container">
            <h3>Group Posts</h3>
            {posts.length === 0 ? (
                <p>No posts to display.</p>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="post-item">
                        <h4>{post.title}</h4>
                        <p>{post.description}</p>
                        <p><strong>Posted by:</strong> {post.name}</p>
                        {post.movieDetails && (
                            <div className="movie-poster-container">
                                <Link to={`/movie/${post.movie_id}`}>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${post.movieDetails.poster_path}`}
                                        alt={`${post.movieDetails.title} poster`}
                                        className="movie-poster"
                                    />
                                </Link>
                            </div>
                        )}
                        <p className="post-date">
                            <strong>Created:</strong> {new Date(post.created).toLocaleString()}
                        </p>

                        {userId === group.owner || userId === post.account_id && (<button
                            className="delete-button"
                            onClick={() => deleteAPost(post.id)}
                        >
                            Delete Post
                        </button>)}
                    </div>
                ))
            )}
        </div>
    );
};

export default Posts;
