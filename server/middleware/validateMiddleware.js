const { validationResult } = require('express-validator');

// Runs after express-validator rules on a route; if any rule failed,
// responds with 400 + the list of validation errors instead of continuing.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = validate;