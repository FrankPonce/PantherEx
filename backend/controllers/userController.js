
const pool = require('../config/database');
const authenticateToken = require('../middleware/authMiddleware');
// JavaScript placeholder for controllers/userController.js


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const userResult = await pool.query(
      'SELECT user_id, name, email, profile_pic, address, location, created_at, score FROM users WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get number of sales
    const salesResult = await pool.query(
      'SELECT COUNT(*) FROM items WHERE user_id = $1 AND sold = $2',
      [userId, true]
    );
    const salesCount = parseInt(salesResult.rows[0].count) || 0;

    // Send the user data in the response
    res.status(200).json({
      ...userResult.rows[0],
      sales: salesCount,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { name, email, password_hash, profile_pic } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, profile_pic) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, password_hash, profile_pic]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};


// Get current user's profile
// Get current user's profile
// controllers/userController.js

const getMyProfile = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const userResult = await pool.query(
      'SELECT user_id, name, email, profile_pic, address, location, created_at FROM users WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get number of sales using 'sold' column
    const salesResult = await pool.query(
      'SELECT COUNT(*) FROM items WHERE user_id = $1 AND sold = $2',
      [userId, true]
    );
    const salesCount = parseInt(salesResult.rows[0].count) || 0;

    // Since you might not have a 'reviews' table yet, set score to a default value
    const score = 0;

    // Send the user data in the response
    res.status(200).json({
      ...userResult.rows[0],
      sales: salesCount,
      score: score,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};




// Update current user's profile

const updateMyProfile = async (req, res) => {
  const userId = req.user.user_id;

  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

  const fields = [];
  const values = [];
  let fieldIndex = 1;

  // Handle profile_pic
  if (req.file) {
    fields.push(`profile_pic = $${fieldIndex}`);
    values.push(req.file.location);
    fieldIndex++;
  }

  // Loop through possible fields
  const possibleFields = ['name', 'email', 'address', 'location'];
  for (const field of possibleFields) {
    if (req.body[field] !== undefined && req.body[field].trim() !== '') {
      fields.push(`${field} = $${fieldIndex}`);
      values.push(req.body[field]);
      fieldIndex++;
    }
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  values.push(userId); // Add userId as the last parameter

  const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = $${fieldIndex} RETURNING *`;

  try {
    const result = await pool.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};







module.exports = { getAllUsers, createUser, getMyProfile,
  updateMyProfile, getUserById, };
