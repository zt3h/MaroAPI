module.exports = async (req, res) => {
  return res.status(404).json({
    success: false,
    cause: 'Route was not found.'
  });
};
