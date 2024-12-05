import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    location: '',
    profile_pic: '',
  });

  const [uploadedImage, setUploadedImage] = useState(null);
  const [userStats, setUserStats] = useState({
    sales: 0,
    score: 0,
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data;

        console.log('User Data:', userData);

        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          address: userData.address || '',
          location: userData.location || '',
          profile_pic: userData.profile_pic || '',
        });

        setUserStats({
          sales: userData.sales || 0,
          score: userData.score || 0,
        });

        if (userData.profile_pic) {
          setUploadedImage({
            file: null,
            previewUrl: userData.profile_pic,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

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
      setUploadedImage({ file, previewUrl });
    }
  };

  // Remove the uploaded image
  const removeImage = () => {
    setUploadedImage(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if any fields have been edited
    if (
      !isEditingName &&
      !isEditingEmail &&
      !isEditingAddress &&
      !isEditingLocation &&
      !uploadedImage
    ) {
      alert('No changes to save.');
      return;
    }
  
    const data = new FormData();
  
    if (isEditingName && formData.name.trim() !== '') {
      data.append('name', formData.name);
    }
  
    if (isEditingEmail && formData.email.trim() !== '') {
      data.append('email', formData.email);
    }
  
    if (isEditingAddress) {
      data.append('address', formData.address);
    }
  
    if (isEditingLocation) {
      data.append('location', formData.location);
    }
  
    if (uploadedImage && uploadedImage.file) {
      data.append('profile_pic', uploadedImage.file);
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/users/me', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Profile updated:', response.data);
  
      // Update the state with the new data
      setFormData({
        ...formData,
        name: response.data.name || formData.name,
        email: response.data.email || formData.email,
        address: response.data.address || formData.address,
        location: response.data.location || formData.location,
      });
  
      if (response.data.profile_pic) {
        setUploadedImage({
          file: null,
          previewUrl: response.data.profile_pic,
        });
      }
  
      // Reset editing states
      setIsEditingName(false);
      setIsEditingEmail(false);
      setIsEditingAddress(false);
      setIsEditingLocation(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  return (
    <div className="profile-container">
      <h1 className="profile-title">MY PROFILE</h1>

      <div className="profile-form">
        {/* Profile Picture Section */}
        <div className="upload-section">
          <div className="photo-info">Upload a profile picture.</div>
          {uploadedImage ? (
            <div className="image-preview">
              <img src={uploadedImage.previewUrl} alt="Profile preview" className="preview-image" />
              <button onClick={removeImage} className="remove-image">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="image-preview">
              <img
                src={formData.profile_pic || '/default-avatar.png'}
                alt="Profile"
                className="preview-image"
              />
            </div>
          )}
          <div className="upload-box">
            <label className="upload-button">
              <Upload size={24} />
              <span>Upload Photo</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        {/* Name */}
        <div className="form-field">
          <label>Name</label>
          <div className="input-with-button">
            {isEditingName ? (
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
            ) : (
              <span className="field-label">{formData.name || 'Your Name'}</span>
            )}
            <button
              type="button"
              className="edit-button"
              onClick={() => setIsEditingName(!isEditingName)}
            >
              {isEditingName ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Email */}
        <div className="form-field">
          <label>Email</label>
          <div className="input-with-button">
            {isEditingEmail ? (
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
              />
            ) : (
              <span className="field-label">{formData.email || 'Your Email'}</span>
            )}
            <button
              type="button"
              className="edit-button"
              onClick={() => setIsEditingEmail(!isEditingEmail)}
            >
              {isEditingEmail ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Address */}
        <div className="form-field">
          <label>Address</label>
          <div className="input-with-button">
            {isEditingAddress ? (
              <input
                type="text"
                name="address"
                placeholder="Your Address"
                value={formData.address}
                onChange={handleChange}
              />
            ) : (
              <span className="field-label">{formData.address || 'Your Address'}</span>
            )}
            <button
              type="button"
              className="edit-button"
              onClick={() => setIsEditingAddress(!isEditingAddress)}
            >
              {isEditingAddress ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="form-field">
          <label>Location</label>
          <div className="input-with-button">
            {isEditingLocation ? (
              <input
                type="text"
                name="location"
                placeholder="Your Location"
                value={formData.location}
                onChange={handleChange}
              />
            ) : (
              <span className="field-label">{formData.location || 'Your Location'}</span>
            )}
            <button
              type="button"
              className="edit-button"
              onClick={() => setIsEditingLocation(!isEditingLocation)}
            >
              {isEditingLocation ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>

        {/* User Stats */}
        <div className="user-stats">
          <div className="stat-field">
            <label>Sales</label>
            <p>{userStats.sales}</p>
          </div>
          <div className="stat-field">
            <label>Score</label>
            <p>{userStats.score}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button type="button" className="save-changes-btn" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
