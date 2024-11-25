import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeleteAccount.css';

const DeleteAccount = () => {
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        try {
            setError('');
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('You must be logged in');
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:5000/api/auth/account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.status === 401) {
                localStorage.removeItem('token');
                setError('Session expired. Please login again.');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to delete account');
            }

            localStorage.clear();
            setIsConfirming(false); 
            setSuccess(true); 
            
            // redirect in 2 sec
            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error('Error deleting account:', error);
            setError(error.message || 'Failed to delete account. Please try again.');
        }
    };

    return (
        <div className="delete-account-container">
            {error && <div className="error-message">{error}</div>}
            
            {success ? (
                <div className="success-message">
                    Account successfully deleted. Redirecting...
                </div>
            ) : (
                <>
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
                                    onClick={() => {
                                        setIsConfirming(false);
                                        setError('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DeleteAccount;