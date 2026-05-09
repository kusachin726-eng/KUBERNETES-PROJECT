const express = require('express');
const router = express.Router();

/**
 * Crew Routes
 * Routes for crew-specific functionality
 */
router.use('/crew/booking', require('../modules/v1/Crew/Booking/booking.routes'));

module.exports = router;
