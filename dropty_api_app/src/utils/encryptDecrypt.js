const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const keyLength = 32;
const ivLength = 16;
const saltLength = 16;

function encryptData(data, password) {
    const salt = crypto.randomBytes(saltLength);
    const key = crypto.pbkdf2Sync(password, salt, 100000, keyLength, 'sha256');
   
    // Generate a random initialization vector (IV)
    const iv = crypto.randomBytes(ivLength);
   
    // Create a cipher instance
    const cipher = crypto.createCipheriv(algorithm, key, iv);
   
    // Encrypt the data
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
   
    // Return the salt, IV, and encrypted data as a single object
    return {
        salt: salt.toString('hex'),
        iv: iv.toString('hex'),
        encryptedData: encrypted
    };
}

// Function to decrypt data
function decryptData(encryptedObj, password) {
    const { salt, iv, encryptedData } = encryptedObj;
    // Derive the key using the salt
    const key = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 100000, keyLength, 'sha256');
    // Create a decipher instance
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = {
    encryptData,
    decryptData
};
