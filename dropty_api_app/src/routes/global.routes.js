const express = require('express');
const router = express.Router();

/**
 * Global Routes
 * Public routes accessible to all users
 */
router.use('/auth', require('../modules/v1/Auth/auth.routes'));
router.use('/user', require('../modules/v1/User/user.routes'));
router.use('/upload', require('../modules/v1/Upload/upload.routes'));
router.use('/storage', require('../modules/v1/Upload/upload.routes'));

module.exports = router;
