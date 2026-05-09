const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } = require("@azure/storage-blob");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_CONTAINER
);

const SIZES = {
  small: { width: 300, height: 300 },
  medium: { width: 800, height: 800 },
  large: { width: 1200, height: 1200 },
};

async function uploadBufferToAzure(buffer, fileName, mimeType) {
  await containerClient.createIfNotExists();
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  
  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
    },
  });

  return blockBlobClient.url;
}


async function processAndUploadImage(file,folder) {
  const fileExtension = path.extname(file.originalname).toLowerCase();

  // Sharp supports jpeg, png, webp, avif, tiff, keep original if possible or convert to webp/jpeg for compression
  let format = 'jpeg';
  if (fileExtension === '.png') format = 'png';
  if (fileExtension === '.webp') format = 'webp';
 
  const baseFileName = `${uuidv4()}`;
  const uploadPromises = [];
  const results = {
    fileName: `${baseFileName}${fileExtension}`
  };

  for (const [sizeName, dimensions] of Object.entries(SIZES)) {
    const fileName = `${folder}/${sizeName}/${baseFileName}${fileExtension}`;
    
    const processingPromise = sharp(file.buffer)
      .resize(dimensions.width, dimensions.height, {
        fit: 'cover', // crop to cover the dimensions
        position: 'center'
      })
      .toFormat(format, { quality: 80 }) // compress
      .toBuffer()
      .then(buffer => uploadBufferToAzure(buffer, fileName, file.mimetype))
      .then(url => {
        results[sizeName] = url;
      });

    uploadPromises.push(processingPromise);
  }

  await Promise.all(uploadPromises);
  return results;
}

/**
 * Generate SAS URL for an image
 * @param {string} filename - The filename (uuid + extension)
 * @param {string} size - size (small, medium, large)
 * @param {string} folder - optional folder path (e.g. 'customer/profile')
 * @returns {string} - The full URL with SAS token
 */
function generateSasUrl(filename, size = 'medium', folder = null) {
  if (!SIZES[size]) {
    throw new Error('Invalid size parameter. Must be small, medium, or large.');
  }
  
  let blobName = `${size}/${filename}`;
  if (folder) {
    blobName = `${folder}/${blobName}`;
  }

  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  
  // This is a robust way to extract it
  const matches = process.env.AZURE_STORAGE_CONNECTION_STRING.match(/AccountName=([^;]+);AccountKey=([^;]+)/);
  if (!matches) {
    throw new Error('Invalid Azure Storage Connection String');
  }
  const accountName = matches[1];
  const accountKey = matches[2];
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  const sasOptions = {
    containerName: process.env.AZURE_STORAGE_CONTAINER,
    blobName: blobName,
    permissions: BlobSASPermissions.parse("r"), // Read only
    expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour
  };

  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
  
  return `${blockBlobClient.url}?${sasToken}`;
}

module.exports = {
  processAndUploadImage,
  generateSasUrl
};
