const express = require('express');
const router = express.Router();

/**
 * Customer Routes
 * Routes for customer-specific functionality
 */
router.use('/customer/booking', require('../modules/v1/Customer/Booking/booking.routes'));
router.use('/customer', require('../modules/v1/Customer/DamageBaggageReport/damageReport.routes'));
router.use('/static', require('../modules/v1/static-pages/static-pages.routes'));
router.use('/customer/notification', require('../modules/v1/Customer/Notification/notification.routes'));

module.exports = router;
