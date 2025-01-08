const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateSchedule } = require('../middleware/validate');

router.get('/availability', authenticate, scheduleController.getAvailability);
router.post('/book', authenticate, validateSchedule, scheduleController.bookAppointment);
router.get('/calendar', authenticate, scheduleController.getCalendar);
router.post('/slots', authenticate, isAdmin, scheduleController.createTimeSlots);
router.put('/slots/:id', authenticate, isAdmin, scheduleController.updateTimeSlot);