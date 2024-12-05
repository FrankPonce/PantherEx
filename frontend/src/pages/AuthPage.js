// src/pages/AuthPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import './AuthPage.css';
import logo from '../assets/logo.png';
import fiuImage from '../assets/fiuImage.jpg';

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Redirect to /items if already logged in
  if (token) {
    return <Navigate to="/items" />;
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin ? { email, password } : { email, password, name };

    try {
      const response = await axios.post(url, payload);
      setMessage(response.data.message);

      if (isLogin && response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin(); // Notify App.js of successful login
        navigate('/items'); // Redirect to Item Listings Page on successful login
      }
    } catch (error) {
      setMessage(error.response?.data.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-section">
        <div className="logo-container">
          <img src={logo} alt="Panther Logo" className="panther-logo" />
        </div>
        
        <div className="auth-box">
          <h1 className="sign-in-title">{isLogin ? 'SIGN IN' : 'SIGN UP'}</h1>
          <form className="auth-form" onSubmit={handleAuth}>
            {!isLogin && (
              <div className="form-group">
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            )}
            <div className="form-group">
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="sign-in-button">
              {isLogin ? 'SIGN IN' : 'SIGN UP'}
            </button>
          </form>
          {message && <p className="auth-message">{message}</p>}
          <div className="signup-prompt">
            {isLogin ? "Don't have an account yet?" : "Already have an account?"}
            <span onClick={toggleAuthMode} className="signup-link">
              {isLogin ? ' SIGN UP' : ' SIGN IN'}
            </span>
          </div>
        </div>
      </div>

      <div className="image-section">
        <img src={fiuImage} alt="FIU Building" className="fiu-image" />
        <div className="image-overlay">
          <h2 className="overlay-text">
            Your trusted<br />
            marketplace for<br />
            FIU students.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
