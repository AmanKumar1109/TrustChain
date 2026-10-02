const crypto = require('crypto');

/**
 * Derives a 32-byte key from any secret string using SHA-256
 */
function getDerivedKey(secret) {
  return crypto.createHash('sha256').update(String(secret)).digest();
}

/**
 * Encrypt plain text using AES-256-CBC
 * @param {string} text Plain text to encrypt
 * @param {string} secretKey Secret encryption key
 * @returns {string} iv:encryptedData (hex encoded)
 */
function encrypt(text, secretKey) {
  if (!text) throw new Error('Text to encrypt cannot be empty');
  if (!secretKey) throw new Error('Encryption key is required');

  const key = getDerivedKey(secretKey);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt cipher text using AES-256-CBC
 * @param {string} encryptedText iv:encryptedData (hex encoded)
 * @param {string} secretKey Secret encryption key
 * @returns {string} Decrypted plain text
 */
function decrypt(encryptedText, secretKey) {
  if (!encryptedText) throw new Error('Encrypted text cannot be empty');
  if (!secretKey) throw new Error('Encryption key is required');

  const key = getDerivedKey(secretKey);
  const parts = encryptedText.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted text format (expected iv:ciphertext)');
  }

  const [ivHex, encrypted] = parts;
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

module.exports = {
  encrypt,
  decrypt,
};
