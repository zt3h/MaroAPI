const db = require('../storage/database');
const router = require('express').Router();

let bazaar = {};

const retrievePrices = async function () {
  for (const item of await db.bazaar.find({}, { _id: 0, __v: 0 })) {
    bazaar[item.id] = item;
  }
};

router.get('/all', async (req, res) => {
  if (Object.keys(bazaar).length === 0) {
    return res.status(404).json({
      status: 404,
      data: 'No products found.'
    });
  }

  return res.status(200).json({
    status: 200,
    data: bazaar
  });
});

retrievePrices();
setInterval(() => retrievePrices(), 60 * 10000);

module.exports = router;
