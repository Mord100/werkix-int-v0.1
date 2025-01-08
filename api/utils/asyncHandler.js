// utils/asyncHandler.js

/**
 * Wraps an async function and handles any errors that occur
 * Eliminates the need for try/catch blocks in controllers
 * 
 * @param {Function} fn - Async function to be wrapped
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};

module.exports = asyncHandler;

// Example usage in a controller:
/*
const asyncHandler = require('../utils/asyncHandler');

exports.getSomething = asyncHandler(async (req, res) => {
    const data = await Something.find();
    res.json(data);
    // No try/catch needed - errors will be caught and passed to error handling middleware
});
*/