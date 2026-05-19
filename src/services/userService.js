const userModel = require('../models/userModel');

async function listUsers(options) {
  return userModel.listUsers(options);
}

async function updateRole(userId, role) {
  return userModel.updateRole(userId, role);
}

module.exports = {
  listUsers,
  updateRole
};
