const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

authenticate.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else if (req.user) {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  } else {
    return res.status(401).json({ message: 'User not found' });
  }
};

authenticate.getAllUsers = async (req, res) => {
  if (req.user && req.user.role === 'admin') {
    const users = await User.find({}, '-password');
    res.json(users);
  } else {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

module.exports = authenticate;