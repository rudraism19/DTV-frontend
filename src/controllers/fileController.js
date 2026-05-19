const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');
const fileService = require('../services/fileService');
const fileModel = require('../models/fileModel');

const upload = asyncHandler(async function(req, res) {
  if (!req.file) {
    throw new ApiError(400, 'File is required.');
  }

  const uploaded = await fileService.uploadFile(req.file, req.user);
  res.status(201).json({
    file: uploaded
  });
});

const getById = asyncHandler(async function(req, res) {
  const record = await fileModel.findById(req.params.id);
  if (!record) {
    throw new ApiError(404, 'File not found.');
  }

  if (record.user_id && record.user_id !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied for this file.');
  }

  res.json({
    file: {
      id: record.id,
      url: record.url,
      contentType: record.content_type,
      sizeBytes: record.size_bytes,
      createdAt: record.created_at
    }
  });
});

module.exports = {
  upload,
  getById
};
