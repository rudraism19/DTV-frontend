const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');

const getMyData = asyncHandler(async function(req, res) {
  const data = await userModel.getAppData(req.user.id);
  res.json({ data: data });
});

const saveMyData = asyncHandler(async function(req, res) {
  if (req.user.role === 'parent') {
    throw new ApiError(403, 'Parents cannot modify student state globally.');
  }
  const data = await userModel.saveAppData(req.user.id, req.body.data || {});
  res.json({ data: data });
});

const getStudentData = asyncHandler(async function(req, res) {
  const studentId = req.params.studentId;
  const data = await userModel.getAppData(studentId);
  res.json({ data: data });
});

module.exports = {
  getMyData,
  saveMyData,
  getStudentData
};
