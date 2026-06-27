const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for a given user id.
 * @param {number} userId
 * @returns {string} signed JWT
 */
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

module.exports = generateToken;