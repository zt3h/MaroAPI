const createJsonResponse = function (res, code, reason) {
  return res.status(code).json({
    status: code,
    cause: reason
  });
};

module.exports = async (req, res, next) => {
  if (req.method === 'POST') {
    if (!req.body.hasOwnProperty('data')) {
      return createJsonResponse(res, 400, 'Request body is missing "data" field.');
    }

    if (!req.body.data.hasOwnProperty('inv_armor')) {
      return createJsonResponse(res, 400, "A player's profile data must be provided.");
    }
  }

  return next();
};
