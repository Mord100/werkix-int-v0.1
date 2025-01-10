const express = require('express');
const router = express.Router();
const { body, check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const fittingController = require('../controllers/fittingController');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const isValidDate = (value) => {
  if (!value) {
    throw new Error('Date is required');
  }
  
  const date = new Date(value);
  
  if (isNaN(date.getTime()) || date < new Date()) {
    throw new Error('Invalid date');
  }
  
  return true;
};

router.put('/:id',
  authMiddleware,
  authMiddleware.isAdmin,
  [
    check('type').isIn(['swing-analysis', 'club-fitting']),
    body('date').custom(isValidDate),
    check('comments').optional().isString(),
    check('time').optional().isString(),
    check('clubType').optional().isString()
  ],
  validateRequest,
  fittingController.updateFitting
);

router.post('/request',
    authMiddleware,
    [
      check('type').isIn(['swing-analysis', 'club-fitting']),
      body('date').custom(isValidDate),
      check('comments').optional().isString(),
      check('time').optional().isString(),
      check('clubType').optional().isString()
    ],
    validateRequest,
    fittingController.createFittingRequest
  );
  
  router.put('/:id',
    authMiddleware,
    authMiddleware.isAdmin,
    [
      check('type').isIn(['swing-analysis', 'club-fitting']),
      body('date').custom(isValidDate),
      check('comments').optional().isString(),
      check('time').optional().isString(),
      check('clubType').optional().isString()
    ],
    validateRequest,
    fittingController.updateFitting
  );

router.get('/:id', 
  authMiddleware, 
  fittingController.getFittingById
);

router.put('/:id',
  authMiddleware,
  authMiddleware.isAdmin,
  [
    check('type').isIn(['swing-analysis', 'club-fitting']),
    check('scheduledDate').isDate(),
    check('comments').optional().isString()
  ],
  validateRequest,
  fittingController.updateFitting
);

// Get a specific swing analysis by ID
router.get('/:id', authMiddleware, fittingController.getFittingById);

// Update swing analysis measurements
router.put('/:id/measurements', authMiddleware, fittingController.updateFittingMeasurements);

// Cancel a swing analysis
router.put('/:id/cancel', authMiddleware, fittingController.cancelFitting);

// Get user's fittings with optional type filter
router.get('/', authMiddleware, fittingController.getUserFittings);

// Get all fittings for the current user
router.get('/', authMiddleware, fittingController.getUserFittings);

module.exports = router;