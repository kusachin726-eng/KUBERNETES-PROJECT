const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

const uploadSingleImage = upload.single('file'); // Expect a field named 'file'

module.exports = { uploadSingleImage };