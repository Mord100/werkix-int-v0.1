const express = require('express');
const router = express.Router();
const fittingController = require('../controllers/fittingController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateFitting } = require('../middleware/validate');

router.post('/request', authenticate, validateFitting, fittingController.createFittingRequest);
router.get('/my-fittings', authenticate, fittingController.getUserFittings);
router.get('/all', authenticate, isAdmin, fittingController.getAllFittings);
router.put('/:id/status', authenticate, isAdmin, fittingController.updateFittingStatus);
router.get('/:id', authenticate, fittingController.getFittingById);
router.put('/:id', authenticate, isAdmin, fittingController.updateFitting);