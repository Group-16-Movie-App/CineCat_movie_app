import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteAccount.css';

const DeleteAccount = () => {
    const [isConfirming, setIsConfirming] = useState(false);
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('http://localhost:5000/api/account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Clear local storage and redirect to home
                localStorage.removeItem('token');
                navigate('/');
                window.location.reload(); // Refresh to update UI
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete account');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Failed to delete account. Please try again.');
        }
    };

    return (
        <div className="delete-account-container">
            {!isConfirming ? (
                <button 
                    className="delete-account-button"
                    onClick={() => setIsConfirming(true)}
                >
                    Delete Account
                </button>
            ) : (
                <div className="confirmation-dialog">
                    <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                    <div className="confirmation-buttons">
                        <button 
                            className="confirm-button"
                            onClick={handleDeleteAccount}
                        >
                            Yes, Delete My Account
                        </button>
                        <button 
                            className="cancel-button"
                            onClick={() => setIsConfirming(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteAccount;
