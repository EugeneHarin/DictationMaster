const { scryptSync, timingSafeEqual } = require('crypto');

// const hashPassword = (password) => {
//   const salt = randomBytes(16).toString('hex');
//   const hashedPassword = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');
//   const hash = `${salt}:${hashedPassword}`;
//   return hash;
// }

const verifyPassword = (inputPassword, storedPassword) => {
  const [salt, key] = storedPassword.split(':');
  const hashedBuffer = scryptSync(inputPassword, salt, 64, { N: 16384, r: 8, p: 1 }).toString('hex');
  const keyBuffer = Buffer.from(key, 'hex');
  const match = timingSafeEqual(Buffer.from(hashedBuffer, 'hex'), Buffer.from(keyBuffer, 'hex'));
  if (match) return true;
  else return false;
}

module.exports = { verifyPassword };
