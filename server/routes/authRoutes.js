const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const validate = require('../middleware/validateMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

// Strong password rule: min 8 chars, at least one letter and one number
const strongPassword = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/\d/)
  .withMessage('Password must contain at least one number')
  .matches(/[a-zA-Z]/)
  .withMessage('Password must contain at least one letter');

router.post(
  '/register',
  authLimiter,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    strongPassword,
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  ],
  validate,
  register
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.post('/logout', logout);

router.post(
  '/forgot-password',
  authLimiter,
  [body('email').isEmail().withMessage('A valid email is required').normalizeEmail()],
  validate,
  forgotPassword
);

router.post(
  '/reset-password',
  authLimiter,
  [body('token').notEmpty().withMessage('Reset token is required'), strongPassword],
  validate,
  resetPassword
);

module.exports = router;