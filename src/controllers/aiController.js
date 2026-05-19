const asyncHandler = require('../utils/asyncHandler');
const aiService = require('../services/aiService');

const sendMessages = asyncHandler(async function(req, res) {
  const result = await aiService.sendMessages(req.body || {});
  if (result.error) {
    return res.status(result.status || 500).json({ error: result.error });
  }
  return res.status(200).json(result.data);
});

module.exports = {
  sendMessages
};
