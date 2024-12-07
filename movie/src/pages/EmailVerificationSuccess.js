import React from 'react';
import './EmailVerificationSuccess.css';

const EmailVerificationSuccess = () => {
  return (
    <div className="containerEmail">
      <div className="cardEmail">
        <div className="iconEmail">✔️</div>
        <h2 className="titleEmail">Your email has been successfully verified!</h2>
        <p className="messageEmail">You can now log in to your account.</p>
        <a href="/" className="buttonEmail">
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default EmailVerificationSuccess;
