const Schedule = require('../models/Schedule');
const TimeSlot = require('../models/TimeSlot');
const asyncHandler = require('../utils/asyncHandler');

exports.getAvailability = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ message: 'Start and end dates are required' });
  }

  const availability = await TimeSlot.find({
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    isAvailable: true
  }).sort('date');

  res.json(availability);
});

exports.bookAppointment = asyncHandler(async (req, res) => {
  const { date, timeSlotId, serviceType } = req.body;
  
  const timeSlot = await TimeSlot.findById(timeSlotId);
  
  if (!timeSlot) {
    return res.status(404).json({ message: 'Time slot not found' });
  }

  if (!timeSlot.isAvailable) {
    return res.status(400).json({ message: 'Time slot is not available' });
  }

  const schedule = new Schedule({
    user: req.user._id,
    date,
    timeSlot: timeSlotId,
    serviceType,
    status: 'Booked'
  });

  timeSlot.isAvailable = false;
  
  await Promise.all([
    schedule.save(),
    timeSlot.save()
  ]);
  
  res.status(201).json(schedule);
});

exports.getCalendar = asyncHandler(async (req, res) => {
  const schedules = await Schedule.find({ 
    user: req.user._id 
  })
  .populate('timeSlot', 'date startTime endTime')
  .sort('-date');

  res.json(schedules);
});

exports.createTimeSlots = asyncHandler(async (req, res) => {
  const { date, startTime, endTime, duration } = req.body;

  const timeSlots = [];
  let currentStart = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);

  while (currentStart < end) {
    const slotEnd = new Date(currentStart.getTime() + duration * 60000);
    
    if (slotEnd > end) break;

    const timeSlot = new TimeSlot({
      date,
      startTime: currentStart.toTimeString().slice(0,5),
      endTime: slotEnd.toTimeString().slice(0,5),
      isAvailable: true
    });

    timeSlots.push(timeSlot);
    currentStart = slotEnd;
  }

  const savedTimeSlots = await TimeSlot.insertMany(timeSlots);
  
  res.status(201).json(savedTimeSlots);
});

exports.updateTimeSlot = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, startTime, endTime, duration } = req.body;

  const timeSlot = await TimeSlot.findById(id);

  if (!timeSlot) {
    return res.status(404).json({ message: 'Time slot not found' });
  }

  if (date) timeSlot.date = date;
  if (startTime) timeSlot.startTime = startTime;
  if (endTime) timeSlot.endTime = endTime;
  
  await timeSlot.save();
  
  res.json(timeSlot);
});