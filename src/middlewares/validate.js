const ApiError = require('../utils/apiError');

function validate(schema) {
  return function(req, _res, next) {
    const result = schema.validate({
      body: req.body,
      params: req.params,
      query: req.query
    }, {
      abortEarly: false,
      stripUnknown: true
    });

    if (result.error) {
      return next(new ApiError(400, 'Validation failed.', result.error.details));
    }

    if (result.value.body) {
      req.body = result.value.body;
    }
    if (result.value.params) {
      req.params = result.value.params;
    }
    if (result.value.query) {
     req.validatedQuery = result.value.query;
    }
    return next();
  };
}

module.exports = validate;
