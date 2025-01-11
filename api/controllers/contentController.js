const Content = require('../models/Content');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// Middleware to check admin role
const isAdmin = async (req) => {
  if (!req.user) {
    throw new Error('Authentication required');
  }

  const user = await User.findById(req.user._id);
  return user && user.role === 'admin';
};

// Get Banner Content
exports.getBannerContent = asyncHandler(async (req, res) => {
  // Ensure only authenticated users can access banner content
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Fetch banner content from database or return default
  const bannerContent = await Content.findOne({ type: 'getting_started', active: true }) || {
    title: 'Golf Club Fitting',
    content: 'Welcome to Golf Club Fitting - Your one-stop solution for all your golf needs. We offer a wide range of products and services to help you play better, stay healthier, and enjoy your time on the golf course.'
  };

  res.json({
    title: bannerContent.title,
    description: bannerContent.content
  });
});

// Update Banner Content
exports.updateBannerContent = asyncHandler(async (req, res) => {
  // Ensure only admin can update banner content
  if (!(await isAdmin(req))) {
    return res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }

  const { title, description } = req.body;

  // Validate input
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  // Find existing banner content or create new
  let bannerContent = await Content.findOne({ type: 'getting_started', active: true });
  
  if (!bannerContent) {
    bannerContent = new Content({
      type: 'getting_started',
      active: true
    });
  }

  // Update content
  bannerContent.title = title;
  bannerContent.content = description;
  bannerContent.lastUpdatedBy = req.user._id;

  // Save and return updated content
  await bannerContent.save();
  
  res.json({
    title: bannerContent.title,
    description: bannerContent.content
  });
});