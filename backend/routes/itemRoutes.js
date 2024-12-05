// routes/itemRoutes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { itemUpload } = require('../config/s3Config'); // Import the itemUpload instance
const {
  getAllItems,
  createItem,
  getItemById,
  updateItem,
  deleteItem,
  getBrands,
} = require('../controllers/itemController');

router.get('/', getAllItems);
router.post('/', authenticateToken, itemUpload.single('image'), createItem);
router.get('/brands', getBrands);
router.get('/:id', getItemById);
router.get('/user/:userId', getItemsByUserId); // Add this route
router.put('/:id', authenticateToken, updateItem);
router.delete('/:id', authenticateToken, deleteItem);

module.exports = router;
