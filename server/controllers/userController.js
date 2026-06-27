const bcrypt = require('bcrypt');
const prisma = require('../config/db');
const { success, error } = require('../utils/apiResponse');

const SAFE_USER_SELECT = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  profileImage: true,
  createdAt: true,
  updatedAt: true,
};

// @route   GET /api/users/profile
async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: SAFE_USER_SELECT,
    });

    if (!user) {
      return error(res, 404, 'User not found');
    }

    return success(res, 200, 'Profile retrieved successfully', { user });
  } catch (err) {
    next(err);
  }
}

// @route   PUT /api/users/profile
async function updateProfile(req, res, next) {
  try {
    const { fullName, email, phone } = req.body;

    // If changing email, make sure it isn't already taken by someone else
    if (email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== req.user.id) {
        return error(res, 409, 'That email is already in use');
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(fullName !== undefined && { fullName }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
      },
      select: SAFE_USER_SELECT,
    });

    return success(res, 200, 'Profile updated successfully', { user });
  } catch (err) {
    next(err);
  }
}

// @route   PUT /api/users/change-password
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return error(res, 401, 'Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    return success(res, 200, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
}

// @route   PUT /api/users/avatar
async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      return error(res, 400, 'No image file provided');
    }

    // Path the frontend can use directly, e.g. http://localhost:5000/uploads/avatars/xxx.jpg
    const imagePath = `/uploads/avatars/${req.file.filename}`;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { profileImage: imagePath },
      select: SAFE_USER_SELECT,
    });

    return success(res, 200, 'Avatar uploaded successfully', { user });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile, changePassword, uploadAvatar };