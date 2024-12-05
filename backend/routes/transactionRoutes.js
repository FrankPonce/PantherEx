// JavaScript placeholder for routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { getAllTransactions, createTransaction, getTransactionById } = require('../controllers/transactionController');

// Define transaction routes
router.get('/', getAllTransactions);            // Get all transactions
router.post('/', createTransaction);            // Create a new transaction
router.get('/:id', getTransactionById);         // Get transaction by ID

module.exports = router;
