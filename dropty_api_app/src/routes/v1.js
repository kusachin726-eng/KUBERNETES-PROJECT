const express = require('express');
const router = express.Router();

/**
 * Route Aggregation
 * Combines all modular routes from separate files
 */

// Global Routes (public access)
router.use('/', require('./global.routes'));

// CRM Routes (admin access)
router.use('/', require('./crm.routes'));

// Customer Routes
router.use('/', require('./customer.routes'));

// Crew Routes
router.use('/', require('./crew.routes'));

// Test Queue Route (Proof of Concept)
router.use('/test-queue', require('./testQueue'));

module.exports = router;