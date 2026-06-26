const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const userService = require('../services/userService');

const listUsers = asyncHandler(async function(req, res) {
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const offset = Number(req.query.offset || 0);
  const search = req.query.search || '';

  const result = await userService.listUsers({
    limit: limit,
    offset: offset,
    search: search
  });

  res.json({
    users: result.users,
    total: result.total,
    limit: limit,
    offset: offset
  });
});

const updateRole = asyncHandler(async function(req, res) {
  const userId = req.params.id;
  const role = req.body.role;

  const updated = await userService.updateRole(userId, role);
  if (!updated) {
    throw new ApiError(404, 'User not found.');
  }
  res.json({
    user: {
      id: updated.id,
      email: updated.email,
      role: updated.role,
      name: updated.name,
      avatarUrl: updated.avatarUrl,
      isActive: updated.isActive
    }
  });
});

const updateStatus = asyncHandler(async function(req, res) {
  const userId = req.params.id;
  const isActive = req.body.isActive;

  if (userId.toString() === req.user.id.toString()) {
    throw new ApiError(403, 'You cannot block yourself.');
  }

  const updated = await userService.updateActiveStatus(userId, isActive);
  if (!updated) {
    throw new ApiError(404, 'User not found.');
  }
  res.json({
    user: {
      id: updated.id,
      email: updated.email,
      isActive: updated.isActive
    }
  });
});

module.exports = {
  listUsers,
  updateRole,
  updateStatus
};
