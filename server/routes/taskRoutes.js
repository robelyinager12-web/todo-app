const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

router.use(protect);

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const STATUSES = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

const toUpper = (value) => (typeof value === 'string' ? value.toUpperCase() : value);

const taskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('description').optional().trim(),
  body('categoryId').optional().isInt().withMessage('Invalid category'),
  body('priority')
    .optional()
    .customSanitizer(toUpper)
    .isIn(PRIORITIES)
    .withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`),
  body('status')
    .optional()
    .customSanitizer(toUpper)
    .isIn(STATUSES)
    .withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
];

// IMPORTANT: /stats must come before /:id, otherwise Express treats "stats" as an :id param
router.get('/stats', getTaskStats);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', taskValidation, validate, createTask);
router.put('/:id', taskValidation, validate, updateTask);
router.patch(
  '/status',
  [
    body('id').isInt().withMessage('Task id is required'),
    body('status')
      .customSanitizer(toUpper)
      .isIn(STATUSES)
      .withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
  ],
  validate,
  updateTaskStatus
);
router.delete('/:id', deleteTask);

module.exports = router;