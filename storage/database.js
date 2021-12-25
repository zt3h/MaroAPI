const mongoose = require('mongoose');
const config = require('../config');

const createDatabaseConnection = function () {
  try {
    mongoose.connection.on('connected', () => {
      console.log('Database connection opened successfully');
    });

    mongoose.connection.on('error', e => {
      console.log('An error occured while connecting to the database ' + e);
    });

    mongoose.connect(config.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
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
