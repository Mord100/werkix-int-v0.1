const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');

router.post('/',
  [
    check('name').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('role').isIn(['consumer', 'admin'])
  ],
  userController.createUser
);

router.post('/login',
  [
    check('email').isEmail(),
    check('password').exists()
  ],
  userController.login
);

router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.post('/change-password', authMiddleware, userController.changePassword);
router.delete('/:id', authMiddleware, userController.deleteUser);

module.exports = router;