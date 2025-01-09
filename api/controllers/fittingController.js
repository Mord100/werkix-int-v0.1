const Fitting = require('../models/Fitting');
const Schedule = require('../models/Schedule');
const asyncHandler = require('../utils/asyncHandler');

exports.createFittingRequest = asyncHandler(async (req, res) => {
  const { type, scheduledDate, comments } = req.body;
  
  const fitting = await Fitting.create({
    customer: req.user._id,
    type,
    scheduledDate,
    comments,
    statusHistory: [{
      status: 'Fitting Request Submitted',
      updatedBy: req.user._id
    }]
  });

  res.status(201).json(fitting);
});

exports.getUserFittings = asyncHandler(async (req, res) => {
  const fittings = await Fitting.find({ customer: req.user._id })
    .sort('-scheduledDate')
    .populate('customer', 'profile.firstName profile.lastName');
    
  res.json(fittings);
});

exports.getAllFittings = asyncHandler(async (req, res) => {
  const fittings = await Fitting.find().sort('-scheduledDate');

  res.json(fittings);
});

exports.updateFittingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const fitting = await Fitting.findById(req.params.id);
  
  if (!fitting) {
    return res.status(404).json({ message: 'Fitting not found' });
  }

  fitting.status = status;
  fitting.statusHistory.push({
    status,
    updatedBy: req.user._id
  });

  await fitting.save();
  res.json(fitting);
});

exports.getFittingById = asyncHandler(async (req, res) => {
  const fitting = await Fitting.findById(req.params.id).populate('customer', 'profile.firstName profile.lastName');

  if (!fitting) {
    return res.status(404).json({ message: 'Fitting not found' });
  }

  res.json(fitting);
});

exports.updateFitting = asyncHandler(async (req, res) => {
  const { type, scheduledDate, comments } = req.body;
  const fitting = await Fitting.findById(req.params.id);
  
  if (!fitting) {
    return res.status(404).json({ message: 'Fitting not found' });
  }

  fitting.type = type;
  fitting.scheduledDate = scheduledDate;
  fitting.comments = comments;

  await fitting.save();
  res.json(fitting);
});