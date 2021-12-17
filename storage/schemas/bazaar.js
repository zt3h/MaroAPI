const mongoose = require('mongoose');

const bazaarSchema = new mongoose.Schema({
  id: String,
  name: String,
  buyPrice: Number,
  buyVolume: Number,
  buyOrders: Number,
  sellPrice: Number,
  sellVolume: Number,
  sellOrders: Number
});

module.exports = mongoose.model('bazaar', bazaarSchema, 'bazaar');
