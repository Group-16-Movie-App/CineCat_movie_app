import React, { useState } from 'react';
import '../components/AuthForm.css';

export const SignUpForm = ({ onSubmit, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

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
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="success-message">
        <h2>Successfully Registered!</h2>
        <p>Your account has been created successfully.</p>
        <button onClick={onSuccess} className="success-button">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <div className="auth-form-error">{error}</div>}

      <div className="form-group">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="form-input"
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

      <div className="form-group">
        <input
          type="password"
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
          Password must be at least 6 characters long, contain one uppercase letter and one number
        </small>
      </div>

      <button type="submit" className="submit-button">
        Sign Up
      </button>

      {/* Google sign-in button */}
      <a href="http://localhost:5000/api/auth/google" className="google-sign-in-btn">
        <button type="button" className="auth-button google-btn">
          Sign Up with Google
        </button>
      </a>
    </form>
  );
};

export const LoginForm = ({ onSubmit, initialEmail = '' }) => {
  const [formData, setFormData] = useState({
    email: initialEmail,
    password: ''
  });
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

      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => {
            setFormData({ ...formData, password: e.target.value });
            setError('');
          }}
          className="form-input"
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Sign In
      </button>

      {/* Google sign-in button */}
      <a href="http://localhost:5000/api/auth/google" className="google-sign-in-btn">
        <button type="button" className="auth-button google-btn">
          Sign In with Google
        </button>
      </a>
    </form>
  );
};
