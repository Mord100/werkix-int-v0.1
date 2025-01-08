const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    email,
    password,
    profile: { firstName, lastName, phone }
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.status(201).json({ token, user: { 
    email: user.email, 
    profile: user.profile,
    role: user.role 
  }});
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

  res.json({ token, user: { 
    email: user.email, 
    profile: user.profile,
    role: user.role 
  }});
});
