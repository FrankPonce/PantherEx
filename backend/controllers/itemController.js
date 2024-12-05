
const aws = require('aws-sdk');
const pool = require('../config/database');

require('dotenv').config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const createItem = async (req, res) => {
  // Log req.body and req.file to debug
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

  const {
    title,
    description,
    category,
    itemType, // Ensure this matches exactly with the frontend field name
    size,
    condition,
    color,
    price,
    distance,
    brand,
  } = req.body;

  const userId = req.user.user_id; // Use req.user.user_id instead of req.userId

  let imageUrl = null;

  if (req.file) {
    imageUrl = req.file.location; // Use the location provided by multer-s3
  }

  try {
    // Ensure the category exists
    await pool.query(
      'INSERT INTO categories (category_name) VALUES ($1) ON CONFLICT DO NOTHING',
      [category]
    );

    const result = await pool.query(
      `INSERT INTO items (
        name, description, category_name, item_type, size, condition, color, price, distance_to_campus, image_url, user_id, brand
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [title, description, category, itemType, size, condition, color, price, distance, imageUrl, userId, brand]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
};

// Get all items with filters
const getAllItems = async (req, res) => {
  const {
    search,
    brand,
    color,
    size,
    condition,
    category,
    itemType,
    sort,
  } = req.query;

  let query = 'SELECT * FROM items WHERE 1=1';
  let params = [];
  let paramIndex = 1;

  // Helper function to handle array or single value
  const addFilter = (field, value) => {
    if (Array.isArray(value)) {
      query += ` AND ${field} = ANY($${paramIndex})`;
    } else {
      query += ` AND ${field} = $${paramIndex}`;
    }
    params.push(value);
    paramIndex++;
  };

  // Filters
  if (search) {
    query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }
  if (brand) {
    addFilter('brand', brand);
  }
  if (color) {
    addFilter('color', color);
  }
  if (size) {
    addFilter('size', size);
  }
  if (condition) {
    addFilter('condition', condition);
  }
  if (category) {
    query += ` AND category_name = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }
  if (itemType) {
    query += ` AND item_type = $${paramIndex}`;
    params.push(itemType);
    paramIndex++;
  }

  // Sorting
  if (sort) {
    if (sort === 'price_asc') {
      query += ' ORDER BY CAST(price AS NUMERIC) ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY CAST(price AS NUMERIC) DESC';
    }
  }

  try {
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

const getItemsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const itemsResult = await pool.query(
      'SELECT * FROM items WHERE user_id = $1',
      [userId]
    );

    res.status(200).json(itemsResult.rows);
  } catch (error) {
    console.error('Error fetching items by user ID:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
};

// Get brands with counts
const getBrands = async (req, res) => {
  const { search, color, size, condition, category, itemType } = req.query;

  let query = `
    SELECT brand, COUNT(*) AS count
    FROM items
    WHERE 1=1
  `;
  let params = [];
  let paramIndex = 1;

  // Apply filters
  if (search) {
    query += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }
  if (color) {
    if (Array.isArray(color)) {
      query += ` AND color = ANY($${paramIndex})`;
      params.push(color);
    } else {
      query += ` AND color = $${paramIndex}`;
      params.push(color);
    }
    paramIndex++;
  }
  if (size) {
    if (Array.isArray(size)) {
      query += ` AND size = ANY($${paramIndex})`;
      params.push(size);
    } else {
      query += ` AND size = $${paramIndex}`;
      params.push(size);
    }
    paramIndex++;
  }
  if (condition) {
    if (Array.isArray(condition)) {
      query += ` AND condition = ANY($${paramIndex})`;
      params.push(condition);
    } else {
      query += ` AND condition = $${paramIndex}`;
      params.push(condition);
    }
    paramIndex++;
  }
  if (category) {
    query += ` AND category_name = $${paramIndex}`;
    params.push(category);
    paramIndex++;
  }
  if (itemType) {
    query += ` AND item_type = $${paramIndex}`;
    params.push(itemType);
    paramIndex++;
  }

  query += ' GROUP BY brand ORDER BY brand';

  try {
    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Error fetching brands', error: error.message });
  }
};




// Define getItemById function
// controllers/itemController.js

// controllers/itemController.js

const getItemById = async (req, res) => {
  const itemId = req.params.id;

  try {
    const itemResult = await pool.query(
      `SELECT items.*, 
              users.name AS seller_name, 
              users.profile_pic AS seller_profile_pic, 
              users.created_at AS seller_created_at, 
              users.score AS seller_score
       FROM items
       JOIN users ON items.user_id = users.user_id
       WHERE items.item_id = $1`,
      [itemId]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const item = itemResult.rows[0];

    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching item by ID:', error);
    res.status(500).json({ message: 'Error fetching item' });
  }
};

// Define updateItem function
const updateItem = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    itemType,
    size,
    condition,
    color,
    price,
    distance,
  } = req.body;

  try {
    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2, category_name = $3, size = $4, condition = $5, color = $6, price = $7, distance_to_campus = $8 WHERE item_id = $9 RETURNING *',
      [title, description, category, size, condition, color, price, distance, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Item not found for update' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
};

// Define deleteItem function
const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM items WHERE item_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Item not found for deletion' });
    } else {
      res.status(200).json({ message: 'Item deleted successfully', item: result.rows[0] });
    }
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getBrands,
  getItemsByUserId,
};
