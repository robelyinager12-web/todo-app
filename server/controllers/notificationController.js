const prisma = require('../config/db');
const { success } = require('../utils/apiResponse');

// @route   GET /api/notifications
// Returns lightweight task lists the frontend can render as alerts/badges.
// No separate "notifications" table is needed — these are derived live from tasks.
async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const baseSelect = {
      id: true,
      title: true,
      dueDate: true,
      priority: true,
      status: true,
    };

    const [overdueTasks, dueSoonTasks, recentlyCompleted] = await Promise.all([
      prisma.task.findMany({
        where: { userId, status: { not: 'COMPLETED' }, dueDate: { lt: now } },
        select: baseSelect,
        orderBy: { dueDate: 'asc' },
      }),
      prisma.task.findMany({
        where: {
          userId,
          status: { not: 'COMPLETED' },
          dueDate: { gte: now, lte: in24h },
        },
        select: baseSelect,
        orderBy: { dueDate: 'asc' },
      }),
      prisma.task.findMany({
        where: {
          userId,
          status: 'COMPLETED',
          updatedAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
        },
        select: baseSelect,
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
    ]);

    return success(res, 200, 'Notifications retrieved successfully', {
      overdueTasks,
      dueSoonTasks,
      recentlyCompleted,
      totalAlerts: overdueTasks.length + dueSoonTasks.length,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getNotifications };