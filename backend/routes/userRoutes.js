// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getMyProfile,
  getUserById, // Add this line
  updateMyProfile,
} = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware');
const { profilePicUpload } = require('../config/s3Config');

router.get('/', getAllUsers);
router.post('/', createUser);
router.get('/me', authenticateToken, getMyProfile);
router.put('/me', authenticateToken, profilePicUpload.single('profile_pic'), updateMyProfile);
router.get('/:id', getUserById); // Add this route

module.exports = router;
