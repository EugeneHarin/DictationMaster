const crypto = require('crypto');
const scrypt = require('scrypt-js');

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16);
  const passwordBuffer = Buffer.from(password);
  const key = scrypt.syncScrypt(passwordBuffer, salt, 16384, 8, 1, 64);
  const hash = `${salt.toString('hex')}:${Buffer.from(key).toString('hex')}`; // Convert salt to hex
  return hash;
}

const verifyPassword = (inputPassword, storedHash) => {
  const [saltHex, key] = storedHash.split(':');
  const saltBuffer = Buffer.from(saltHex, 'hex'); // Convert hex back to Buffer
  const passwordBuffer = Buffer.from(inputPassword);
  const inputKey = scrypt.syncScrypt(passwordBuffer, saltBuffer, 16384, 8, 1, 64);
  return key === Buffer.from(inputKey).toString('hex');
}

module.exports = {
  hashPassword,
  verifyPassword,
};
