// Single shared Prisma Client instance used across the whole app
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;