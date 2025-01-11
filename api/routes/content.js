const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/auth');

// Get Banner Content (Authenticated users)
router.get('/banner', authMiddleware, contentController.getBannerContent);

// Update Banner Content (Admin only)
router.put('/banner', authMiddleware, contentController.updateBannerContent);

module.exports = router;