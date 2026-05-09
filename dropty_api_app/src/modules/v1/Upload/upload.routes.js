const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const { uploadSingleImage } = require('../../../middleware/multer/singleImageUpload');
const checkRole = require('../../../middleware/auth/checkRole');
const { uploadMultipleImages } = require('../../../middleware/multer/multipleImageUpload');



router.get(
    '/image/:filename',
    checkRole(["customer", "admin", "crew"]),
    uploadController.viewImage
);

router.post(
    '/singleImageUpload',
    checkRole(["customer", "admin", "crew"]),
    uploadSingleImage,
    uploadController.uploadSingleImage
);

router.post(
    '/multipleImageUpload',
    checkRole(["customer", "admin", "crew"]),
    uploadMultipleImages,
    uploadController.multipleImageUpload
)
module.exports = router;
