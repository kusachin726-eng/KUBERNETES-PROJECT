const express = require('express');
const router = express.Router();
const staticController = require('./static-pages.controller');

router.get('/faq', staticController.getFaq.bind(staticController));
router.get('/terms', staticController.getTerms.bind(staticController));
router.get('/privacy', staticController.getPrivacy.bind(staticController));

module.exports = router;
