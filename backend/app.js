const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/database');

dotenv.config();

const app = express();
app.use(express.json());

// Add CORS middleware before routes
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Correctly importing routers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Use the routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
