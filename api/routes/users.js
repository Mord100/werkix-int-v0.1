const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validate');

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, validateUserUpdate, userController.updateProfile);
router.get('/all', authenticate, isAdmin, userController.getAllUsers);
router.get('/:id', authenticate, isAdmin, userController.getUserById);