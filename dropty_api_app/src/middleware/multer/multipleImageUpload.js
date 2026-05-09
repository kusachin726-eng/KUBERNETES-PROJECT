// multiple image upload using multer
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  }
});

const uploadMultipleImages = upload.array('files', 5); // Expect a field named 'files' with max 5 files

module.exports = { uploadMultipleImages };