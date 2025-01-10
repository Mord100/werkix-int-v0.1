const Fitting = require('../models/Fitting');
const Schedule = require('../models/Schedule');
const asyncHandler = require('../utils/asyncHandler');

exports.createFittingRequest = asyncHandler(async (req, res) => {
  const { 
    type, 
    date: scheduledDate, 
    comments, 
    time, 
    clubType 
  } = req.body;
  
  if (type === 'club-fitting' && (!time || !clubType)) {
    return res.status(400).json({ 
      message: 'Time and club type are required for a club fitting request' 
    });
  }

  const fitting = await Fitting.create({
    customer: req.user._id,
    type,
    scheduledDate: new Date(scheduledDate),
    comments,
    time, 
    statusHistory: [{
      status: 'Fitting Request Submitted',
      updatedBy: req.user._id
    }],
    measurements: type === 'club-fitting' ? { clubType } : {}
  });

  res.status(201).json(fitting);
});

exports.getUserFittings = asyncHandler(async (req, res) => {
  const { type } = req.query;

  const query = { customer: req.user._id };
  
  if (type) {
    query.type = type;
  }

  const fittings = await Fitting.find(query)
    .sort('-scheduledDate')
    .populate('customer', 'profile.firstName profile.lastName');
    
  res.json(fittings);
});

exports.getAllUserFittings = asyncHandler(async (req, res) => {
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
  const { id } = req.params;

  // Basic validation
  if (!id) {
    return res.status(400).json({ message: 'Fitting ID is required' });
  }

  try {
    const fitting = await Fitting.findById(id).populate('customer', 'profile.firstName profile.lastName');

    if (!fitting) {
      return res.status(404).json({ message: 'Fitting not found' });
    }

    res.json(fitting);
  } catch (error) {
    // Handle potential cast errors
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid fitting ID format' });
    }
    
    // Generic error handler
    res.status(500).json({ 
      message: 'Error fetching fitting', 
      error: error.message 
    });
  }
});

exports.updateFitting = asyncHandler(async (req, res) => {
  const { 
    type, 
    date: scheduledDate, 
    comments, 
    time, 
    clubType 
  } = req.body;
  
  const fitting = await Fitting.findById(req.params.id);
  
  if (!fitting) {
    return res.status(404).json({ message: 'Fitting not found' });
  }

  // Update fields
  fitting.type = type;
  fitting.scheduledDate = new Date(scheduledDate);
  fitting.comments = comments;
  fitting.time = time;
  
  // Update measurements for club fitting
  if (type === 'club-fitting') {
    fitting.measurements = { clubType };
  } else {
    fitting.measurements = {};
  }

  await fitting.save();
  res.json(fitting);
});

// Update swing analysis measurements
exports.updateFittingMeasurements = asyncHandler(async (req, res) => {
  const { measurements } = req.body;
  const fitting = await Fitting.findById(req.params.id);
  
  if (!fitting) {
    return res.status(404).json({ message: 'Fitting not found' });
  }

  // Verify it's a swing analysis
  if (fitting.type !== 'swing-analysis') {
    return res.status(400).json({ message: 'Not a swing analysis fitting' });
  }

  fitting.measurements = measurements;
  await fitting.save();
  
  res.json(fitting);
});

// Cancel a fitting
exports.cancelFitting = asyncHandler(async (req, res) => {
  const fitting = await Fitting.findById(req.params.id);
  
  if (!fitting) {
    return res.status(404).json({ message: 'Fitting not found' });
  }

  fitting.status = 'Fitting Canceled';
  fitting.statusHistory.push({
    status: 'Fitting Canceled',
    updatedBy: req.user._id
  });

  await fitting.save();
  res.json(fitting);
});