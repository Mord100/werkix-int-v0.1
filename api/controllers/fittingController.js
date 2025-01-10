const Fitting = require('../models/Fitting');
const Schedule = require('../models/Schedule');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

// Middleware to check admin role
const isAdmin = async (req) => {
  if (!req.user) {
    throw new Error('Authentication required');
  }

  const user = await User.findById(req.user._id);
  return user && user.role === 'admin';
};

exports.createFittingRequest = asyncHandler(async (req, res) => {
  // If admin, allow creating fitting for any user
  if (await isAdmin(req)) {
    const { 
      type, 
      date: scheduledDate, 
      comments, 
      time, 
      clubType,
      customer // Allow specifying customer when admin creates fitting
    } = req.body;
    
    if (type === 'club-fitting' && (!time || !clubType)) {
      return res.status(400).json({ 
        message: 'Time and club type are required for a club fitting request' 
      });
    }

    const fitting = await Fitting.create({
      customer: customer || req.user._id, // Use provided customer or current user
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

    return res.status(201).json(fitting);
  }

  // Regular user flow
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
  // If admin, allow fetching fittings for any user
  if (await isAdmin(req)) {
    const { userId, type } = req.query;

    const query = userId ? { customer: userId } : {};
    
    if (type) {
      query.type = type;
    }

    const fittings = await Fitting.find(query)
      .sort('-scheduledDate')
      .populate('customer', 'profile.firstName profile.lastName profile.email profile.phone');
      
    return res.json(fittings);
  }

  // Regular user flow
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

exports.getAllFittings = asyncHandler(async (req, res) => {
  // Ensure only admin can access all fittings
  if (!(await isAdmin(req))) {
    return res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }

  const fittings = await Fitting.find()
    .sort('-scheduledDate')
    .populate({
      path: 'customer',
      select: 'profile.firstName profile.lastName profile.email profile.phone'
    });

  // Transform fittings to include customer details
  const transformedFittings = fittings.map(fitting => ({
    _id: fitting._id,
    type: fitting.type,
    status: fitting.status,
    scheduledDate: fitting.scheduledDate,
    createdAt: fitting.createdAt,
    time: fitting.time,
    comments: fitting.comments,
    customerName: `${fitting.customer.profile.firstName} ${fitting.customer.profile.lastName}`,
    customerEmail: fitting.customer.profile.email,
    customerPhone: fitting.customer.profile.phone,
    measurements: fitting.measurements
  }));

  res.json(transformedFittings);
});

exports.updateFittingStatus = asyncHandler(async (req, res) => {
  // Ensure only admin can update fitting status
  if (!(await isAdmin(req))) {
    return res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }

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
  // If admin, allow access to any fitting
  if (await isAdmin(req)) {
    const { id } = req.params;

    // Basic validation
    if (!id) {
      return res.status(400).json({ message: 'Fitting ID is required' });
    }

    try {
      const fitting = await Fitting.findById(id).populate('customer', 'profile.firstName profile.lastName profile.email profile.phone');

      if (!fitting) {
        return res.status(404).json({ message: 'Fitting not found' });
      }

      return res.json(fitting);
    } catch (error) {
      // Handle potential cast errors
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid fitting ID format' });
      }
      
      // Generic error handler
      return res.status(500).json({ 
        message: 'Error fetching fitting', 
        error: error.message 
      });
    }
  }

  // Regular user flow - only access their own fittings
  const { id } = req.params;

  // Basic validation
  if (!id) {
    return res.status(400).json({ message: 'Fitting ID is required' });
  }

  try {
    const fitting = await Fitting.findOne({ 
      _id: id, 
      customer: req.user._id 
    }).populate('customer', 'profile.firstName profile.lastName');

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
  // If admin, allow updating any fitting
  if (await isAdmin(req)) {
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
    return res.json(fitting);
  }

  // Regular user flow - only update their own fittings
  const { 
    type, 
    date: scheduledDate, 
    comments, 
    time, 
    clubType 
  } = req.body;
  
  const fitting = await Fitting.findOne({ 
    _id: req.params.id, 
    customer: req.user._id 
  });
  
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

exports.updateFittingMeasurements = asyncHandler(async (req, res) => {
  // If admin, allow updating measurements for any fitting
  if (await isAdmin(req)) {
    const { measurements } = req.body;
    const fitting = await Fitting.findById(req.params.id);
    
    if (!fitting) {
      return res.status(404).json({ message: 'Fitting not found' });
    }

    fitting.measurements = measurements;
    await fitting.save();
    
    return res.json(fitting);
  }

  // Regular user flow - only update measurements for their own fittings
  const { measurements } = req.body;
  const fitting = await Fitting.findOne({ 
    _id: req.params.id, 
    customer: req.user._id 
  });
  
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

exports.cancelFitting = asyncHandler(async (req, res) => {
  // If admin, allow canceling any fitting
  if (await isAdmin(req)) {
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
    return res.json(fitting);
  }

  // Regular user flow - only cancel their own fittings
  const fitting = await Fitting.findOne({ 
    _id: req.params.id, 
    customer: req.user._id 
  });
  
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