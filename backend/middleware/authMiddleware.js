const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  // Get token from headers
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader); // Log auth header
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Token:', token); // Log extracted token

  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.status(403).json({ message: 'Forbidden' });
    }
    console.log('Decoded token:', decoded); // Log decoded token
    req.user = decoded; // Attach decoded token to req.user
    next();
  });
};

module.exports = authenticateToken;
