const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  id: String,
  sales: Array,
  auction: Object
});

module.exports = mongoose.model('auctions', auctionSchema, 'auctions');
