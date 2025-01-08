require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const fittingRoutes = require('./routes/fittings');
const scheduleRoutes = require('./routes/schedule');

const PORT = process.env.PORT || 3001;

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/fittings', fittingRoutes);
app.use('/api/schedule', scheduleRoutes);

// Base route for API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Golf Fitting API is running',
    timestamp: new Date()
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found'
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  app.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});