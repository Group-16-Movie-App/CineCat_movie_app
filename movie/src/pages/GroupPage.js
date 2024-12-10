import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import GroupMembers from '../components/GroupMembers';
import MembershipRequests from '../components/MembershipRequests';
import GroupMovies from '../components/GroupMovies';
import GroupSchedules from '../components/GroupSchedules';
import GroupComments from '../components/GroupComments';
import AddMovie from '../components/AddMovie';
import '../components/GroupStyles.css';

const GroupPage = () => {
    const { id } = useParams();
    const userData = localStorage.getItem('user');
    const userId = userData ? JSON.parse(userData).id : null;

    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const [isMember, setIsMember] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        const fetchGroup = async () => {
            if (!id) {
                setError('Invalid group ID');
                return;
            }
    
            try {
                const response = await axios.get(`http://localhost:5000/api/groups/${id}`);
                const groupData = response.data;
    
                console.log('Group data:', groupData); 
    
                const ownerName = groupData.owner_name; 
    
                setGroup({ ...groupData, owner_name: ownerName });
    
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
    
    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
    };
    
    const handleDeleteGroup = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/groups/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Group deleted successfully!');
            // Redirect or refresh the group list
        } catch (error) {
            console.error('Error deleting group:', error);
            alert('Failed to delete group.');
        }
    };
     const handleAddMovie = (movie) => {
        setSelectedMovie(movie); 
    };

    const handleLeaveGroup = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/groups/${id}/members/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsMember(false);
            alert('You have left the group');
        } catch (error) {
            console.error('Error leaving group:', error);
            alert('Failed to leave the group.');
        }
    };

    if (error) return <div className="error-message">{error}</div>;
    if (!group) return <div>Loading...</div>;

    return (
        <div className="group-container">
            <h2 className="group-title">{group.name}</h2>
            <p className="group-owner">Owner: {group.owner_name}</p>
            <div className="group-layout">
                <div className="group-sidebar">
                    <GroupMembers groupId={id} />
                    <MembershipRequests groupId={id} />
                   
                </div>
                <div className="group-main-content">
                    <div></div>
                    <AddMovie groupId={id} onSelect={handleAddMovie} />
                     <GroupMovies groupId={id} userId={userId} />    
                    {selectedMovie && (
                        
                        <div className="selected-movie">
                            <div className="selected-movie-container">
                            <h3>Selected Movie for Discussion</h3>
                            <img 
                                src={selectedMovie.poster_path ? `https://image.tmdb.org/t/p/w200${selectedMovie.poster_path}` : 'path/to/placeholder/image.jpg'} 
                                alt={selectedMovie.title} 
                            />
                            <p>Title: {selectedMovie.title}</p>
                            <p>Rating: {selectedMovie.vote_average}</p>
                            <GroupComments groupId={id} userId={userId} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isMember ? (
                <button onClick={handleLeaveGroup}>Leave Group</button>
            ) : (
                <button disabled>Not a member</button>
            )}

            {group.owner === userId && (
                <button onClick={handleDeleteGroup}>Delete Group</button>
            )}
        </div>
    );
};

export default GroupPage;