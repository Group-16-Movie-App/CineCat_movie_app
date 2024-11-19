import React, { useState } from 'react';

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
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        onSubmit(formData);
      } else {
        setError(data.error || 'Email already exists');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Registration failed. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#4CAF50' }}>Successfully Registered!</h2>
        <p>Your account has been created successfully.</p>
        <button 
          onClick={onSuccess} 
          style={{ 
            padding: '0.5rem 2rem', 
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && (
        <div style={{ 
          color: '#f44336', 
          padding: '0.5rem', 
          marginBottom: '1rem',
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{ width: '100%', padding: '0.5rem' }}
          required
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ width: '100%', padding: '0.5rem' }}
          required
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => {
            setFormData({...formData, password: e.target.value});
            setError(''); 
          }}
          style={{ width: '100%', padding: '0.5rem' }}
          required
        />
        <small style={{ 
          color: '#666', 
          fontSize: '0.8rem', 
          display: 'block', 
          marginTop: '0.5rem' 
        }}>
          Password must be at least 6 characters long, contain one uppercase letter and one number
        </small>
      </div>
      <button type="submit" style={{ 
        width: '100%', 
        padding: '0.5rem', 
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
      }}>
        Sign Up
      </button>
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
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();

      if (response.ok) {
        onSubmit(formData);
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      {error && (
        <div style={{ 
          color: '#f44336', 
          padding: '0.5rem', 
          marginBottom: '1rem',
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => {
            setFormData({...formData, email: e.target.value});
            setError('');
          }}
          style={{ width: '100%', padding: '0.5rem' }}
          required
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => {
            setFormData({...formData, password: e.target.value});
            setError('');
          }}
          style={{ width: '100%', padding: '0.5rem' }}
          required
        />
      </div>
      <button type="submit" style={{ 
        width: '100%', 
        padding: '0.5rem', 
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
      }}>
        Sign In
      </button>
    </form>
  );
};