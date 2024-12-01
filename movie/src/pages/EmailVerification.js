import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './EmailVerification.css';
import ModalWindow from '../components/ModalWindow'; 
import { LoginForm } from '../components/AuthForms'
const EmailVerification = () => {
  const [isVerified, setIsVerified] = useState(false); 
  const [error, setError] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();  

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); 
    const token = urlParams.get('token');

    console.log('Token received on frontend:', token);
  
    if (!token) {
        setError('Invalid verification link');
        return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/verify-email?token=${token}`);

        if (!response.ok) {
            const errorData = await response.text(); 
            console.error('Error response:', errorData); 
            setError('Verification failed, please try again');
            return;
        }

        const data = await response.json();
        console.log('API Response:', data);

        setIsVerified(true);
        setShowBanner(true);
      } catch (err) {
        console.error('Error:', err); 
        setError('Something went wrong');
      }
    };

    verifyEmail();
  }, [location.search]);  

  const openLoginModal = () => {
    setIsModalOpen(true); 
  };

  const closeLoginModal = () => {
    setIsModalOpen(false); 
  };

  const handleLoginSubmit = (formData) => {
   
    console.log('Login data submitted:', formData);
    closeLoginModal();
    navigate('/');
  };

  return (
    <div className="email-verification-container">
      <div className="verification-box">
        {showBanner && (
          <div className="confirmation-banner">
            <h2>Your email has been verified successfully!</h2>
          </div>
        )}

        {isVerified ? (
          <div className="success-message">
            <h2>Success!</h2>
            <p>Your email has been verified successfully.</p>
            <button onClick={openLoginModal} className="btn-success">
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
      </div>

      <ModalWindow isOpen={isModalOpen} onClose={closeLoginModal}>
        <LoginForm onSubmit={handleLoginSubmit} />
      </ModalWindow>
    </div>
  );
};

export default EmailVerification;
