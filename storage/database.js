const mongoose = require('mongoose');
const config = require('../config');

const createDatabaseConnection = function () {
  try {
    mongoose.connect(config.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    console.log('Successfully connected to database.');
  } catch (e) {
    console.log(e);
  }
};

createDatabaseConnection();

module.exports = {
  bazaar: require('./schemas/bazaar'),
  auctions: require('./schemas/auctions'),
  leaderboard: require('./schemas/leaderboard')
};
