import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/items?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/items">Items</Link>
      <Link to="/create-listing">Create Listing</Link>
      <Link to="/analytics">Analytics</Link>
      <Link to="/profile">Profile</Link>
      
      
      <form onSubmit={handleSearchSubmit} className="navbar-search-form">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
