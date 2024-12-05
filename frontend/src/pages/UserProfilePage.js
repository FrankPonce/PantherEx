// src/pages/UserProfilePage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { id } = useParams(); // User ID from the URL
  const [userData, setUserData] = useState(null);
  const [availableItems, setAvailableItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUserData(response.data);
      } catch (error) {
        setError('Error fetching user data');
        console.error('Fetch error:', error);
      }
    };

    const fetchUserItems = async () => {
      try {
        const response = await axios.get(`/api/items/user/${id}`);
        const items = response.data;
        setAvailableItems(items.filter(item => !item.sold));
        setSoldItems(items.filter(item => item.sold));
      } catch (error) {
        setError('Error fetching user items');
        console.error('Fetch error:', error);
      }
    };

    fetchUserData();
    fetchUserItems();
  }, [id]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!userData) {
    return <p>Loading...</p>;
  }

  const createdAt = new Date(userData.created_at).toLocaleDateString();

  return (
    <div className="user-profile-container">
      <div className="user-header">
        {userData.profile_pic ? (
          <img src={userData.profile_pic} alt={userData.name} className="user-image" />
        ) : (
          <img src="/default-avatar.png" alt="Default Avatar" className="user-image" />
        )}
        <div className="user-details">
          <h1>{userData.name}</h1>
          <p>Email: {userData.email}</p>
          <p>Location: {userData.location || 'N/A'}</p>
          <p>Score: {userData.score.toFixed(1)} ⭐</p>
          <p>Member Since: {createdAt}</p>
        </div>
      </div>

      <h2>Available Items</h2>
      <div className="items-carousel">
        {availableItems.map(item => (
          <div key={item.item_id} className="item-card">
            <a href={`/items/${item.item_id}`}>
              <img src={item.image_url || '/placeholder.png'} alt={item.name} />
              <p>{item.name}</p>
            </a>
          </div>
        ))}
      </div>

      <h2>Sold Items</h2>
      <div className="items-carousel">
        {soldItems.map(item => (
          <div key={item.item_id} className="item-card sold">
            <img src={item.image_url || '/placeholder.png'} alt={item.name} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfilePage;
