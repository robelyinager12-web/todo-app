const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

router.use(protect);

const nameValidation = body('name')
  .trim()
  .notEmpty()
  .withMessage('Category name is required')
  .isLength({ max: 50 })
  .withMessage('Category name must be 50 characters or fewer');

router.get('/', getCategories);
router.post('/', [nameValidation], validate, createCategory);
router.put('/:id', [nameValidation], validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;