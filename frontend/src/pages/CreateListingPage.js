// src/pages/CreateListingPage.js

import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import axios from 'axios';
import './CreateListingPage.css';


const CreateListingPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    itemType: '',
    size: '',
    condition: '',
    color: '',
    price: '',
    distance: '',
    brand: '', // Added brand field
  });

  const [uploadedImages, setUploadedImages] = useState([]); // Stores image files and previews

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image upload and preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUploadedImages([...uploadedImages, { file, previewUrl }]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      itemType: '',
      size: '',
      condition: '',
      color: '',
      price: '',
      distance: '',
      brand: '',
    });
    setUploadedImages([]);
    setShowColorDropdown(false);
  };

  // Remove an uploaded image
  const removeImage = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
  
    if (uploadedImages.length > 0) {
      data.append('image', uploadedImages[0].file);
    }
  
    console.log([...data.entries()]); // Debugging: log all the data being sent
  
    try {
      const response = await axios.post('/api/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Item created:', response.data);
      resetForm();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };
  

  // Dropdown options
  const categories = ['Clothing', 'Electronics', 'Books', 'Furniture', 'Accessories'];
  const distances = ['On-Campus', '< 2 miles', '2 - 5 miles', '5 - 10 miles', '> 10 miles'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  const colors = [
    { name: 'Black', hex: '#000000' }, { name: 'White', hex: '#FFFFFF' }, { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#00FF00' }, { name: 'Blue', hex: '#0000FF' }, { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Orange', hex: '#FFA500' }, { name: 'Purple', hex: '#800080' }, { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Brown', hex: '#A52A2A' }, { name: 'Beige', hex: '#F5F5DC' }, { name: 'Gray', hex: '#808080' },
    { name: 'Navy', hex: '#000080' }, { name: 'Teal', hex: '#008080' }, { name: 'Maroon', hex: '#800000' },
    { name: 'Olive', hex: '#808000' }, { name: 'Mint', hex: '#98FF98' }, { name: 'Coral', hex: '#FF7F50' },
    { name: 'Burgundy', hex: '#800020' }, { name: 'Lavender', hex: '#E6E6FA' }
  ];

  // Size options based on item type
  const sizeOptions = {
    default: ['XS', 'S', 'M', 'L', 'XL'],
    shoes: ['6', '7', '8', '9', '10', '11', '12'],
    pants: ['28', '30', '32', '34', '36', '38'],
  };

  const isClothingCategory = formData.category === 'Clothing';
  const sizeChoices = formData.itemType === 'Shoes' ? sizeOptions.shoes
    : formData.itemType === 'Bottoms' ? sizeOptions.pants
    : sizeOptions.default;

  const [showColorDropdown, setShowColorDropdown] = useState(false);

  const toggleColorDropdown = () => setShowColorDropdown(!showColorDropdown);

  const handleColorSelect = (colorName) => {
    setFormData({ ...formData, color: colorName });
    setShowColorDropdown(false);
  };

  return (
    <div className="listing-container">
      <h1 className="listing-title">SELL AN ITEM</h1>

      <div className="listing-form">
        {/* Photos Section */}
        <div className="upload-section">
          <div className="photo-info">Add up to 20 photos.</div>
          <div className="uploaded-images">
            {uploadedImages.map((image, index) => (
              <div key={index} className="image-preview">
                <img src={image.previewUrl} alt="Uploaded preview" className="preview-image" />
                <button onClick={() => removeImage(index)} className="remove-image">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="upload-box">
            <label className="upload-button">
              <Upload size={24} />
              <span>Upload Photos</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Title */}
        <div className="form-field">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. White COS Jumper"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div className="form-field">
          <label>Describe your item</label>
          <textarea
            name="description"
            placeholder="e.g. only worn a few times, true to size"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div className="form-field">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.map((categoryOption, index) => (
              <option key={index} value={categoryOption}>{categoryOption}</option>
            ))}
          </select>
        </div>

        {/* Item Type */}
        {isClothingCategory && (
          <div className="form-field">
            <label>Item Type</label>
            <select
              name="itemType"
              value={formData.itemType}
              onChange={handleChange}
            >
              <option value="">Select item type</option>
              <option value="Tops">Tops</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Shoes">Shoes</option>
            </select>
          </div>
        )}

        {/* Size */}
        {isClothingCategory && (
          <div className="form-field">
            <label>Size</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
            >
              <option value="">Select size</option>
              {sizeChoices.map((sizeOption, index) => (
                <option key={index} value={sizeOption}>{sizeOption}</option>
              ))}
            </select>
          </div>
        )}

        {/* Brand */}
        <div className="form-field">
          <label>Brand</label>
          <input
            type="text"
            name="brand"
            placeholder="e.g. Nike"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>

        {/* Condition */}
        <div className="form-field">
          <label>Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="">Select condition</option>
            {conditions.map((conditionOption, index) => (
              <option key={index} value={conditionOption}>{conditionOption}</option>
            ))}
          </select>
        </div>

        {/* Color */}
        <div className="form-field">
          <label>Color</label>
          <button type="button" className="color-dropdown-btn" onClick={toggleColorDropdown}>
            {formData.color || 'Select a color'}
          </button>
          {showColorDropdown && (
            <div className="color-grid-dropdown">
              {colors.map((colorOption, index) => (
                <div
                  key={index}
                  className="color-swatch"
                  style={{ backgroundColor: colorOption.hex }}
                  onClick={() => handleColorSelect(colorOption.name)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="form-field">
          <label>Price</label>
          <input
            type="text"
            name="price"
            placeholder="$0.00"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        {/* Distance to Campus */}
        <div className="form-field">
          <label>Distance to Campus</label>
          <select
            name="distance"
            value={formData.distance}
            onChange={handleChange}
          >
            <option value="">Select distance</option>
            {distances.map((distanceOption, index) => (
              <option key={index} value={distanceOption}>{distanceOption}</option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button type="button" className="save-draft-btn">Save Draft</button>
          <button type="button" className="upload-listing-btn" onClick={handleSubmit}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default CreateListingPage;
