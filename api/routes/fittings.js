const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const fittingController = require('../controllers/fittingController');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/request',
  authMiddleware,
  [
    check('type').isIn(['Swing Analysis', 'Club Fitting']),
    check('scheduledDate').isDate(),
    check('comments').optional().isString()
  ],
  validateRequest,
  fittingController.createFittingRequest
);

router.get('/my-fittings', authMiddleware, fittingController.getUserFittings);

router.get('/all', 
  authMiddleware, 
  authMiddleware.isAdmin, 
  fittingController.getAllFittings
);

router.put('/:id/status',
  authMiddleware,
  authMiddleware.isAdmin,
  [
    check('status').isIn([
      'Fitting Request Submitted',
      'Fitting being Prepped',
      'Fitting Scheduled',
      'Fitting Canceled',
      'Fitting Completed'
    ])
  ],
  validateRequest,
  fittingController.updateFittingStatus
);

router.get('/:id', authMiddleware, fittingController.getFittingById);

router.put('/:id',
  authMiddleware,
  authMiddleware.isAdmin,
  [
    check('type').isIn(['Swing Analysis', 'Club Fitting']),
    check('scheduledDate').isDate(),
    check('comments').optional().isString()
  ],
  validateRequest,
  fittingController.updateFitting
);

module.exports = router;