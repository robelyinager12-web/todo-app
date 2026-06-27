const prisma = require('../config/db');
const { success, error } = require('../utils/apiResponse');

const TASK_INCLUDE = {
  category: { select: { id: true, name: true } },
};

// @route   GET /api/tasks
// Supports: ?q=search&status=&priority=&category=&dueDate=&sortBy=&order=&page=&limit=
async function getTasks(req, res, next) {
  try {
    const {
      q,
      status,
      priority,
      category,
      dueDate,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const where = { userId: req.user.id };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status.toUpperCase();
    if (priority) where.priority = priority.toUpperCase();
    if (category) where.categoryId = Number(category);

    if (dueDate) {
      const start = new Date(dueDate);
      const end = new Date(dueDate);
      end.setDate(end.getDate() + 1);
      where.dueDate = { gte: start, lt: end };
    }

    const allowedSortFields = ['createdAt', 'dueDate', 'priority', 'title', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: TASK_INCLUDE,
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limitNum,
      }),
      prisma.task.count({ where }),
    ]);

    return success(res, 200, 'Tasks retrieved successfully', {
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

// @route   GET /api/tasks/stats
async function getTaskStats(req, res, next) {
  try {
    const userId = req.user.id;
    const now = new Date();

    const [total, completed, pending, inProgress, highPriority, urgentPriority, overdue] =
      await Promise.all([
        prisma.task.count({ where: { userId } }),
        prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
        prisma.task.count({ where: { userId, status: 'PENDING' } }),
        prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
        prisma.task.count({ where: { userId, priority: 'HIGH' } }),
        prisma.task.count({ where: { userId, priority: 'URGENT' } }),
        prisma.task.count({
          where: {
            userId,
            status: { not: 'COMPLETED' },
            dueDate: { lt: now },
          },
        }),
      ]);

    return success(res, 200, 'Task statistics retrieved successfully', {
      total,
      completed,
      pending,
      inProgress,
      highPriority: highPriority + urgentPriority,
      overdue,
      completedPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  } catch (err) {
    next(err);
  }
}

// @route   GET /api/tasks/:id
async function getTaskById(req, res, next) {
  try {
    const task = await prisma.task.findFirst({
      where: { id: Number(req.params.id), userId: req.user.id },
      include: TASK_INCLUDE,
    });

    if (!task) {
      return error(res, 404, 'Task not found');
    }

    return success(res, 200, 'Task retrieved successfully', { task });
  } catch (err) {
    next(err);
  }
}

// @route   POST /api/tasks
async function createTask(req, res, next) {
  try {
    const { title, description, categoryId, priority, status, dueDate } = req.body;

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: Number(categoryId), userId: req.user.id },
      });
      if (!category) {
        return error(res, 400, 'Invalid category');
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId: req.user.id,
        categoryId: categoryId ? Number(categoryId) : null,
        priority: priority ? priority.toUpperCase() : undefined,
        status: status ? status.toUpperCase() : undefined,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: TASK_INCLUDE,
    });

    return success(res, 201, 'Task created successfully', { task });
  } catch (err) {
    next(err);
  }
}

// @route   PUT /api/tasks/:id
async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, categoryId, priority, status, dueDate } = req.body;

    const existing = await prisma.task.findFirst({
      where: { id: Number(id), userId: req.user.id },
    });
    if (!existing) {
      return error(res, 404, 'Task not found');
    }

    if (categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: Number(categoryId), userId: req.user.id },
      });
      if (!category) {
        return error(res, 400, 'Invalid category');
      }
    }

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(categoryId !== undefined && { categoryId: categoryId ? Number(categoryId) : null }),
        ...(priority !== undefined && { priority: priority.toUpperCase() }),
        ...(status !== undefined && { status: status.toUpperCase() }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
      include: TASK_INCLUDE,
    });

    return success(res, 200, 'Task updated successfully', { task });
  } catch (err) {
    next(err);
  }
}

// @route   PATCH /api/tasks/status
async function updateTaskStatus(req, res, next) {
  try {
    const { id, status } = req.body;

    const existing = await prisma.task.findFirst({
      where: { id: Number(id), userId: req.user.id },
    });
    if (!existing) {
      return error(res, 404, 'Task not found');
    }

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { status: status.toUpperCase() },
      include: TASK_INCLUDE,
    });

    return success(res, 200, 'Task status updated successfully', { task });
  } catch (err) {
    next(err);
  }
}

// @route   DELETE /api/tasks/:id
async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;

    const existing = await prisma.task.findFirst({
      where: { id: Number(id), userId: req.user.id },
    });
    if (!existing) {
      return error(res, 404, 'Task not found');
    }

    await prisma.task.delete({ where: { id: Number(id) } });

    return success(res, 200, 'Task deleted successfully');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};