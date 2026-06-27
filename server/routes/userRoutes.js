const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes below require a valid JWT
router.use(protect);

router.get('/profile', getProfile);

router.put(
  '/profile',
  [
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('email').optional().isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('phone').optional().trim(),
  ],
  validate,
  updateProfile
);

router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('New password must contain at least one number'),
  ],
  validate,
  changePassword
);

router.put('/avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;