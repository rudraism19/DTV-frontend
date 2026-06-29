const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');
const liveSyncService = require('../services/liveSyncService');

const getMyData = asyncHandler(async function(req, res) {
  const data = await userModel.getAppData(req.user.id);
  res.json({ data: data });
});

const saveMyData = asyncHandler(async function(req, res) {
  if (req.user.role === 'parent') {
    throw new ApiError(403, 'Parents cannot modify student state globally.');
  }
  
  const appData = req.body.data || {};
  const data = await userModel.saveAppData(req.user.id, appData);

  // Enterprise Real-Time Live Sync Dispatcher
  // Identify action type from incoming data or payload metadata
  let actionType = req.body.actionType || 'ACTIVITY_UPDATE';
  let details = req.body.details || { summary: 'App data synchronized with cloud.' };

  if (appData.lastAction) {
    actionType = appData.lastAction.type || actionType;
    details = appData.lastAction.details || details;
  } else if (appData.AIResponses && appData.AIResponses.length > 0) {
    actionType = 'AI_Prompt';
    details = { message: appData.AIResponses[appData.AIResponses.length - 1].userMsg };
  }

  // Dispatch asynchronously to prevent blocking the save response
  liveSyncService.dispatchStudentAction(req.user.id, actionType, details, req.ip || '127.0.0.1').catch(() => {});

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
