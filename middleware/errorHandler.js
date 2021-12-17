module.exports = async (err, req, res, next) => {
  return res.status(500).json({
    success: false,
    cause: err.toString()
  });
};
