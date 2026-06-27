const bcrypt = require('bcrypt');
const crypto = require('crypto');
const prisma = require('../config/db');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const { success, error } = require('../utils/apiResponse');

const DEFAULT_CATEGORIES = ['Personal', 'Work', 'Study', 'Health', 'Shopping'];

// @route   POST /api/auth/register
async function register(req, res, next) {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return error(res, 409, 'An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        // Seed default categories for every new user
        categories: {
          create: DEFAULT_CATEGORIES.map((name) => ({ name })),
        },
      },
      select: { id: true, fullName: true, email: true, createdAt: true },
    });

    const token = generateToken(user.id);

    return success(res, 201, 'Account created successfully', { user, token });
  } catch (err) {
    next(err);
  }
}

// @route   POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return error(res, 401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 401, 'Invalid email or password');
    }

    // Longer-lived token if "Remember Me" is checked
    const token = generateToken(user.id, rememberMe ? '30d' : undefined);

    const { password: _pw, resetToken: _rt, resetTokenExpiry: _rte, ...safeUser } = user;

    return success(res, 200, 'Login successful', { user: safeUser, token });
  } catch (err) {
    next(err);
  }
}

// @route   POST /api/auth/logout
// Stateless JWT — logout is handled client-side by deleting the stored token.
// This endpoint exists for API completeness and future blacklist support.
async function logout(req, res) {
  return success(res, 200, 'Logged out successfully');
}

// @route   POST /api/auth/forgot-password
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    // Always respond the same way, whether or not the email exists,
    // so attackers can't use this endpoint to discover registered emails.
    if (!user) {
      return success(
        res,
        200,
        'If an account with that email exists, a reset link has been sent'
      );
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken, resetTokenExpiry: expiry },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below (valid for 1 hour):</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    });

    return success(
      res,
      200,
      'If an account with that email exists, a reset link has been sent'
    );
  } catch (err) {
    next(err);
  }
}

// @route   POST /api/auth/reset-password
async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return error(res, 400, 'Reset link is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return success(res, 200, 'Password has been reset successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, logout, forgotPassword, resetPassword };