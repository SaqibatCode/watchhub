// middleware/auth.js
const jwt = require('jsonwebtoken');

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    req.user = decoded;  // Attach user info to the request object
    next(); // Allow the request to proceed
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateJWT;
