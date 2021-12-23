const forgeProfitGenerator = require('../generators/forgeGenerator');
const db = require('../storage/database');
const router = require('express').Router();

let profits = null;
let prices = {};

const updateProfits = async function () {
  for (const item of await db.auctions.find()) {
    prices[item.id] = {
      name: item.auction.name,
      price: parseInt(item.auction.price),
      sales: item.sales.sort((a, b) => a.price - b.price),
      type: 'AUCTION'
    };
  }

  for (const product of await db.bazaar.find()) {
    prices[product.id] = {
      name: product.name,
      price: parseInt(product.buyPrice),
      type: 'BAZAAR'
    };
  }

  profits = forgeProfitGenerator.findProfits(prices);
};

router.get('/profits', async (req, res) => {
  if (!profits || profits.length === 0) {
    return res.status(404).json({
      status: 404,
      data: 'No profits found.'
    });
  }

  return res.status(200).json({
    status: 200,
    data: profits
  });
});

updateProfits();
setInterval(() => updateProfits(), 30 * 10000);

module.exports = router;
