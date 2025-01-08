const Joi = require('joi');

// Schema Definitions
const schemas = {
  // Auth Schemas
  registration: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string()
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // User Schemas
  userUpdate: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    phone: Joi.string(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string()
    }),
    golfClubSize: Joi.string().valid('Standard', 'One Inch Short', 'One Inch Long', 'Custom')
  }),

  // Fitting Schemas
  fitting: Joi.object({
    type: Joi.string().valid('Swing Analysis', 'Club Fitting').required(),
    scheduledDate: Joi.date().greater('now').required(),
    comments: Joi.string().allow('', null)
  }),

  fittingStatus: Joi.object({
    status: Joi.string().valid(
      'Fitting Request Submitted',
      'Fitting being Prepped',
      'Fitting Scheduled',
      'Fitting Canceled',
      'Fitting Completed'
    ).required()
  }),

  // Schedule Schemas
  schedule: Joi.object({
    scheduleId: Joi.string().required(),
    timeSlotId: Joi.string().required()
  }),

  timeSlots: Joi.object({
    date: Joi.date().required(),
    slots: Joi.array().items(
      Joi.object({
        startTime: Joi.date().required(),
        endTime: Joi.date().required(),
        isAvailable: Joi.boolean().default(true)
      })
    ).required()
  })
};

// Validation Middleware Factory
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

// Export validation middlewares
module.exports = {
  validateRegistration: validateRequest(schemas.registration),
  validateLogin: validateRequest(schemas.login),
  validateUserUpdate: validateRequest(schemas.userUpdate),
  validateFitting: validateRequest(schemas.fitting),
  validateFittingStatus: validateRequest(schemas.fittingStatus),
  validateSchedule: validateRequest(schemas.schedule),
  validateTimeSlots: validateRequest(schemas.timeSlots),
  
  // Export raw schemas for testing or other uses
  schemas
};

// Usage example in routes:
/*
const express = require('express');
const router = express.Router();
const { validateRegistration } = require('../middleware/validate');

router.post('/register', validateRegistration, authController.register);
*/