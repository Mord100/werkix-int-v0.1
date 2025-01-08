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