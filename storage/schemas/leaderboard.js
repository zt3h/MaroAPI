const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  uuid: String,
  name: String,
  networth: Object
});

module.exports = mongoose.model('leaderboards', leaderboardSchema, 'leaderboards');
