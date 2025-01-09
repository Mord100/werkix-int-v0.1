const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const scheduleController = require('../controllers/scheduleController');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/availability', 
  authMiddleware, 
  scheduleController.getAvailability
);

router.post('/book', 
  authMiddleware, 
  [
    check('date').isISO8601().toDate(),
    check('timeSlotId').isMongoId(),
    check('serviceType').isIn(['Swing Analysis', 'Club Fitting'])
  ],
  validateRequest,
  scheduleController.bookAppointment
);

router.get('/calendar', 
  authMiddleware, 
  scheduleController.getCalendar
);

router.post('/slots', 
  authMiddleware, 
  authMiddleware.isAdmin,
  [
    check('date').isISO8601().toDate(),
    check('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    check('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    check('duration').isInt({ min: 15, max: 120 })
  ],
  validateRequest,
  scheduleController.createTimeSlots
);

router.put('/slots/:id', 
  authMiddleware, 
  authMiddleware.isAdmin,
  [
    check('date').optional().isISO8601().toDate(),
    check('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    check('endTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    check('duration').optional().isInt({ min: 15, max: 120 })
  ],
  validateRequest,
  scheduleController.updateTimeSlot
);

module.exports = router;