const uploadService = require('./upload.service');

const customerAllowedFolders = ['damage-reports', 'profile'];
const adminAllowedFolders = ['damage-reports', 'profile'];
const crewAllowedFolders = ['profile'];

function validateAndCreateFolder(userType, folder, res) {
  if (userType === "customer") {
    console.log("Validating folder for customer:", folder, userType);
    if (!customerAllowedFolders.includes(folder)) {
      return res.status(400).json({ success: false, message: 'Invalid folder for customer' });
    }
    folder = `customer/${folder}`;
  } else if (userType === "admin") {
    if (!adminAllowedFolders.includes(folder)) {
      return res.status(400).json({ success: false, message: 'Invalid folder for admin' });
    }
    folder = `admin/${folder}`;
  } else if (userType === "crew") {
    if (!crewAllowedFolders.includes(folder)) {
      return res.status(400).json({ success: false, message: 'Invalid folder for crew' });
    }
    folder = `crew/${folder}`;
  }

  return folder;
}

async function uploadSingleImage(req, res, next) {
  try {
    let file = req.file;
    let folder = req.body.folder;
    if (!file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    folder = validateAndCreateFolder(req.user.user_type, folder, res);
    if (!folder) return; 
    const imageUrls = await uploadService.processAndUploadImage(file, folder);

    res.status(200).json({
      success: true,
      message: 'Image uploaded and processed successfully',
      data: imageUrls.fileName
    });
  }
  catch (error) {
    next(error);
  }
}

async function multipleImageUpload(req, res, next) {
  try {
    let files = req.files;
    let folder = req.body.folder;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided' });
    }
    folder = validateAndCreateFolder(req.user.user_type, folder, res);
    if (!folder) return;
    const uploadResults = await Promise.all(
      files.map(file => uploadService.processAndUploadImage(file, folder))
    );
    res.status(200).json({
      success: true,
      message: 'Multiple images uploaded and processed successfully',
      data: uploadResults.map(r => r.fileName)
    });
  } catch (error) {
    next(error);
  }
}

async function uploadImage(req, res, next) {
  try {
    let file = req.file;
    let folder = req.folder;
    let userId = req.user.id;

    if (!file && req.files && req.files.length > 0) {
      file = req.files.find(f => f.fieldname === 'image') || req.files[0];
    }

    if (!file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const imageUrls = await uploadService.processAndUploadImage(file, folder);

    res.status(200).json({
      success: true,
      message: 'Image uploaded and processed successfully',
      data: imageUrls
    });
  } catch (error) {
    next(error);
  }
}


async function viewImage(req, res, next) {
  try {
    const { filename } = req.params;
    const { size, folder } = req.query;

    if (!filename) {
      return res.status(400).json({ success: false, message: 'Filename is required' });
    }

    const sasUrl = uploadService.generateSasUrl(filename, size || 'small', folder);

    res.redirect(sasUrl);

  } catch (error) {
    if (error.message.includes('Invalid size')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
}

module.exports = {
  uploadImage,
  uploadSingleImage,
  multipleImageUpload,
  viewImage
};
