import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModalWindow from './ModalWindow';
import { SignUpForm, LoginForm } from './AuthForms';
import './Navbar.css';
import DeleteAccount from './DeleteAccount';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleSignUp = async (formData) => {
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
        setRegisteredEmail(formData.email);
        return true;
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const handleSignUpSuccess = () => {
    setIsSignUpOpen(false);
    setIsLoginOpen(true);
  };

  const handleLogin = async (formData) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        if (data.name) {
          localStorage.setItem('userName', data.name);
        }
        localStorage.setItem('userEmail', data.email);
        setIsLoggedIn(true);
        setIsLoginOpen(false);
        setRegisteredEmail('');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        localStorage.clear();
        handleLogout();
        navigate('/');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/search" className="nav-link">Search</Link>
          <Link to="/filter" className="nav-link">Filter</Link>
          {isLoggedIn && (
            <Link to="/profile" className="nav-link"> My Profile </Link>
          )}
        </div>
        
        <div className="auth-buttons">
          {!isLoggedIn ? (
            <div className="auth-buttons-container">
              <button onClick={() => setIsSignUpOpen(true)} className="auth-button">
                Sign Up
              </button>
              <button onClick={() => setIsLoginOpen(true)} className="auth-button primary">
                Sign In
              </button>
            </div>
          ) : (
            <div className="auth-buttons-container">
              <button onClick={() => setShowDeleteConfirm(true)} className="auth-button danger">
                Delete Account
              </button>
              <button onClick={handleLogout} className="auth-button">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      <ModalWindow isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)}>
        <SignUpForm 
          onSubmit={handleSignUp}
          onSuccess={handleSignUpSuccess}
        />
      </ModalWindow>

      <ModalWindow isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginForm 
          onSubmit={handleLogin}
          initialEmail={registeredEmail}
        />
      </ModalWindow>

      <ModalWindow isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <div className="delete-confirmation">
          <h2>Delete Account</h2>
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <div className="delete-confirmation-buttons">
            <button onClick={() => setShowDeleteConfirm(false)} className="cancel-button">
              Cancel
            </button>
            <button onClick={handleDeleteAccount} className="delete-button">
              Delete Account
            </button>
          </div>
        </div>
      </ModalWindow>
    </div>
  );
};

export default Navbar;

