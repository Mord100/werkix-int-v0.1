const Schedule = require('../models/Schedule');
const asyncHandler = require('../utils/asyncHandler');

exports.getAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const availability = await Schedule.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).sort('date');

  res.json(availability);
});

exports.bookAppointment = asyncHandler(async (req, res) => {
  const { scheduleId, timeSlotId } = req.body;
  
  const schedule = await Schedule.findById(scheduleId);
  const timeSlot = schedule.timeSlots.id(timeSlotId);
  
  if (!timeSlot.isAvailable) {
    return res.status(400).json({ message: 'Time slot is not available' });
  }

  timeSlot.isAvailable = false;
  await schedule.save();
  
  res.json(schedule);
});