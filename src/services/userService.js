const userModel = require('../models/userModel');

async function listUsers(options) {
  return userModel.listUsers(options);
}

async function updateRole(userId, role) {
  return userModel.updateRole(userId, role);
}

async function updateActiveStatus(userId, isActive) {
  return userModel.updateActiveStatus(userId, isActive);
}

module.exports = {
  listUsers,
  updateRole,
  updateActiveStatus
};
