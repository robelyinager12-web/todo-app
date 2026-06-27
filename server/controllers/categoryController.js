const prisma = require('../config/db');
const { success, error } = require('../utils/apiResponse');

// @route   GET /api/categories
async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { tasks: true } },
      },
    });

    // Flatten _count.tasks into a simpler taskCount field for the frontend
    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      createdAt: c.createdAt,
      taskCount: c._count.tasks,
    }));

    return success(res, 200, 'Categories retrieved successfully', { categories: formatted });
  } catch (err) {
    next(err);
  }
}

// @route   POST /api/categories
async function createCategory(req, res, next) {
  try {
    const { name } = req.body;

    const existing = await prisma.category.findFirst({
      where: { userId: req.user.id, name },
    });
    if (existing) {
      return error(res, 409, 'A category with this name already exists');
    }

    const category = await prisma.category.create({
      data: { name, userId: req.user.id },
    });

    return success(res, 201, 'Category created successfully', { category });
  } catch (err) {
    next(err);
  }
}

// @route   PUT /api/categories/:id
async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Make sure the category belongs to this user before allowing the rename
    const category = await prisma.category.findFirst({
      where: { id: Number(id), userId: req.user.id },
    });
    if (!category) {
      return error(res, 404, 'Category not found');
    }

    const duplicate = await prisma.category.findFirst({
      where: { userId: req.user.id, name, NOT: { id: Number(id) } },
    });
    if (duplicate) {
      return error(res, 409, 'A category with this name already exists');
    }

    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    return success(res, 200, 'Category updated successfully', { category: updated });
  } catch (err) {
    next(err);
  }
}

// @route   DELETE /api/categories/:id
// Tasks in this category are NOT deleted — their categoryId is set to null
// (see schema.prisma: onDelete: SetNull on Task.category)
async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: { id: Number(id), userId: req.user.id },
    });
    if (!category) {
      return error(res, 404, 'Category not found');
    }

    await prisma.category.delete({ where: { id: Number(id) } });

    return success(res, 200, 'Category deleted. Its tasks were moved to Uncategorized.');
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };