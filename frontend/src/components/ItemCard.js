// JavaScript placeholder for src/components/ItemCard.js
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ItemCard.css';

const ItemCard = ({ item }) => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.1
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Link
      to={`/items/${item.item_id}`}
      className={`item-card-link ${visible ? 'visible' : ''}`}
    >
      <div className="item-card" ref={ref}>
        {/* Image */}
        <div className="item-image">
          <img src={item.image_url} alt={item.brand} />
        </div>

        {/* Brand */}
        <div className="item-brand">
          <strong>Brand:</strong> {item.brand || 'N/A'}
        </div>

        {/* Size */}
        <div className="item-size">
          <strong>Size:</strong> {item.size || 'N/A'}
        </div>

        {/* Price */}
        <div className="item-price">
          <strong>Price:</strong> $
          {item.price ? Number(item.price).toFixed(2) : '0.00'}
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
