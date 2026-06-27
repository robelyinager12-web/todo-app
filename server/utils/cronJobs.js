const cron = require('node-cron');
const prisma = require('../config/db');

/**
 * Runs every hour. Currently logs overdue/due-soon counts so we have a hook
 * point ready — email sending can be added here later (Phase: notifications v2)
 * without changing how the job is scheduled.
 */
function startCronJobs() {
  cron.schedule('0 * * * *', async () => {
    try {
      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const overdueCount = await prisma.task.count({
        where: { status: { not: 'COMPLETED' }, dueDate: { lt: now } },
      });

      const dueSoonCount = await prisma.task.count({
        where: {
          status: { not: 'COMPLETED' },
          dueDate: { gte: now, lte: in24h },
        },
      });

      if (overdueCount > 0 || dueSoonCount > 0) {
        console.log(
          `[cron] ${overdueCount} overdue task(s), ${dueSoonCount} task(s) due within 24h`
        );
      }
    } catch (err) {
      console.error('[cron] notification job failed:', err.message);
    }
  });

  console.log('[cron] notification job scheduled (runs hourly)');
}

module.exports = startCronJobs;