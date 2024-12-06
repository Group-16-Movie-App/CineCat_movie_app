const handleJoinGroup = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post(`http://localhost:5000/api/groups/${groupId}/join-request`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert(response.data.message); // Show the success message
    } catch (error) {
        if (error.response && error.response.data) {
            alert(error.response.data.message); // Show the error message
        } else {
            alert('An unexpected error occurred.');
        }
    }
}; 