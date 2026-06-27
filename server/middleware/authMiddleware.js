const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

/**
 * Verifies the JWT from the Authorization header and attaches the
 * authenticated user (minus password) to req.user.
 */
async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          profileImage: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }

      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
}

module.exports = { protect };