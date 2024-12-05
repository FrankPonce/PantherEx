import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginNavigate = () => {
    navigate('/auth');
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to PantherExchange</h1>
      <p>Your trusted marketplace for FIU students.</p>
      <button onClick={handleLoginNavigate} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Login / Sign Up
      </button>
    </div>
  );
};

export default HomePage;
