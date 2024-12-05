// src/pages/ItemDetailPage.js

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ItemDetailPage.css';

const ItemDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`/api/items/${id}`);
        console.log('Item data:', response.data); // Debugging: Check if data is fetched
        setItem(response.data);
      } catch (error) {
        setError('Error fetching item details');
        console.error('Fetch error:', error); // Debugging: Log the error
      }
    };

    fetchItemDetails();
  }, [id]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!item) {
    return <p>Loading...</p>;
  }

  // Format the seller's member since date
  const memberSince = item.seller_created_at
    ? new Date(item.seller_created_at).toLocaleDateString()
    : 'N/A';

  // Format the seller's score
  const formatScore = (score) => {
    if (score !== undefined && score !== null) {
      return parseFloat(score).toFixed(1);
    }
    return 'N/A';
  };

  return (
    <div className="item-detail-container">
      <h1 className="item-title">{item.name}</h1>
      {item.image_url && (
        <img src={item.image_url} alt={item.name} className="item-image" />
      )}
      <div className="item-info">
        <p>
          <strong>Description:</strong> {item.description}
        </p>
        <p>
          <strong>Category:</strong> {item.category_name}
        </p>
        <p>
          <strong>Item Type:</strong> {item.item_type || 'N/A'}
        </p>
        <p>
          <strong>Size:</strong> {item.size || 'N/A'}
        </p>
        <p>
          <strong>Condition:</strong> {item.condition}
        </p>
        <p>
          <strong>Color:</strong> {item.color}
        </p>
        <p>
          <strong>Brand:</strong> {item.brand || 'N/A'}
        </p>
        <p>
          <strong>Distance to Campus:</strong> {item.distance_to_campus}
        </p>
        <p>
          <strong>Price:</strong> ${item.price}
        </p>
      </div>
      <div className="seller-info">
        <h2>Seller Information</h2>
        <Link to={`/users/${item.user_id}`} className="seller-link">
          <div className="seller-profile">
            {item.seller_profile_pic ? (
              <img
                src={item.seller_profile_pic}
                alt={item.seller_name}
                className="seller-image"
              />
            ) : (
              <img
                src="/default-avatar.png"
                alt="Default Avatar"
                className="seller-image"
              />
            )}
            <div className="seller-details">
              <p className="seller-name">{item.seller_name}</p>
              <p className="seller-score">
                Score: {formatScore(item.seller_score)} ⭐
              </p>
              <p className="member-since">
                Member Since: {memberSince}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ItemDetailPage;
