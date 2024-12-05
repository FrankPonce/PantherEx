import React from 'react';
import { useParams } from 'react-router-dom';

const CheckoutPage = () => {
  const { id } = useParams(); // item ID from URL

  return (
    <div>
      <h1>Checkout</h1>
      <p>You're about to purchase item with ID: {id}</p>
      <p>This is a simulated checkout process.</p>
      <button>Confirm Purchase</button>
    </div>
  );
};

export default CheckoutPage;
