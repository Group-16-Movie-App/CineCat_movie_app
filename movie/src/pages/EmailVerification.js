import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmailVerification.css';

const EmailVerification = () => {
    const [isVerified, setIsVerified] = useState(false); 
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
  
        if (!token) {
            setError('Invalid verification link');
            return;
        }
  
        const verifyEmail = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/verify-email?token=${token}`);
                const data = await response.json();

                if (response.ok) {
                    setIsVerified(true);
                } else {
                    setError(data.error || 'Verification failed');
                }
            } catch (err) {
                console.error('Error:', err);
                setError('Something went wrong');
            }
        };
  
        verifyEmail();
    }, []);


    console.log('isVerified:', isVerified);
    console.log('error:', error);

    return (
        <div className="email-verification-container">
            <div className="verification-box">
                {isVerified ? (
                    <div className="success-message">
                        <h2>Success!</h2>
                        <p>Your email has been verified successfully.</p>
                        <button onClick={() => navigate('/login')} className="btn-success">
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <div className="error-message">
                        <h2>Verification Failed</h2>
                        <p>{error}</p>
                        <button onClick={() => navigate('/')} className="btn-error">
                            Go to Home
                        </button>
                    </div>
                )}
          
                <div>{`isVerified: ${isVerified}`}</div> 
                <div>{`Error: ${error}`}</div>
            </div>
        </div>
    );
};

export default EmailVerification;
