const totalCPUs = require('os').cpus().length;
const express = require('express');
const cluster = require('cluster');
const path = require('path');
const app = express();

const ValidateBody = require('./middleware/validateBody');
const ErrorHandler = require('./middleware/errorHandler');
const NotFound = require('./middleware/notFound');
const Auctions = require('./routes/auctions');
const Bazaar = require('./routes/bazaar');
const Networth = require('./routes/networth');
const Leaderboard = require('./routes/leaderboard');
const ForgeProfits = require('./routes/forgeProfits');

require('./jobs/updateAuctions');
require('./jobs/updateBazaar');

const createCluster = function () {
  console.log(`Booting Maro's API with ${totalCPUs} instances`);

  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    cluster.fork();
  });
};

const startWebService = async function () {
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(ValidateBody);
  app.use(ErrorHandler);

  app.use('/api/auctions', Auctions);
  app.use('/api/bazaar', Bazaar);
  app.use('/api/networth', Networth);
  app.use('/api/leaderboard', Leaderboard);
  app.use('/api/forge', ForgeProfits);

  app.use(NotFound);

  app.listen(3000);
};

if (cluster.isMaster) {
  createCluster();
} else {
  startWebService();
}
