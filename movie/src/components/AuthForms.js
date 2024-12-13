import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 
import ModalWindow from './ModalWindow';  
import './AuthForm.css';  
import '../pages/EmailVerificationSuccess.js'
import '../pages/EmailVerification.js'
import '../pages/EmailVerification.css'
import '../pages/EmailVerificationSuccess.css'

export const SignUpForm = ({ onSubmit, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); 
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    try {
      const success = await onSubmit(formData);
      if (success) {
        setIsSuccess(true);
        setIsModalOpen(true); 
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
      setIsModalOpen(true); 
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (isSuccess) {
      onSuccess();
      setFormData({ name: '', email: '', password: '' }); 
    }
  };

  return (
    <div>
      {isModalOpen && (
        <ModalWindow isOpen={isModalOpen} onClose={closeModal}>
          {isSuccess ? (
            <div className="success-message">
              <h2>Registration Successful!</h2>
              <p>Please check and confirm your email to complete the registration process.</p>
              <button className="success-button" onClick={closeModal}>Sign in</button>
            </div>
          ) : (
            <div className="auth-form-error">
              {error}
            </div>
          )}
        </ModalWindow>
      )}

      {!isModalOpen && !isSuccess && (
        <form className="auth-form2" onSubmit={handleSubmit}>
          <h2>Create Your Account</h2>
          {error && <div className="auth-form-error">{error}</div>}

          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input2"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group password-group signup-form">
            <input
              type={isPasswordVisible ? "text" : "password"}  
              placeholder="Password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                setError('');
              }}
              className="form-input"
              required
            />
            <small className="password-hint">
              Password must be at least 6 characters long, contain one uppercase letter and one number.
            </small>
            <button
              type="button"
              className="toggle-password-visibility"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}  
            >
              <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} />
            </button>
          </div>

          <button type="submit" className="submit-button-signin">
            SIGN UP
          </button>
        </form>
      )}
    </div>
  );
};

export const LoginForm = ({ onSubmit, initialEmail = '' }) => {
  const [formData, setFormData] = useState({
    email: initialEmail,
    password: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);  
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const success = await onSubmit(formData);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        {error && <div className="auth-form-error">{error}</div>}

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setError(''); 
            }}
            className="form-input"
            required
          />
        </div>

        <div className="form-group password-group login-form">
          <input
            type={isPasswordVisible ? "text" : "password"}  
            placeholder="Password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setError(''); 
            }}
            className="form-input"
            required
          />
          <button
            type="button"
            className="toggle-password-visibility"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)} 
          >
            <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} />
          </button>
        </div>

        <button type="submit" className="submit-button-signin">
          SIGN IN
        </button>
      </form>
    </div>
  );
};



