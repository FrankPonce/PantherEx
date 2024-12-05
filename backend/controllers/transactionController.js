// JavaScript placeholder for controllers/transactionController.js
const pool = require('../config/database');

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

// Create a new transaction
const createTransaction = async (req, res) => {
  const { buyer_id, seller_id, item_id, price_sold } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transactions (buyer_id, seller_id, item_id, price_sold) VALUES ($1, $2, $3, $4) RETURNING *',
      [buyer_id, seller_id, item_id, price_sold]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction' });
  }
};

// Get transaction by ID
const getTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM transactions WHERE transaction_id = $1', [id]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction' });
  }
};

module.exports = { getAllTransactions, createTransaction, getTransactionById };
