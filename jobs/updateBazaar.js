const api = require('../storage/requestHandler');
const helper = require('../src/helper');
const db = require('../storage/database');

let bazaarProducts = {};

const updateProducts = async function () {
  Object.keys(bazaarProducts).forEach(async item => {
    const product = bazaarProducts[item];

    await db.bazaar.updateOne({ id: item }, product, { upsert: true });
  });

  bazaarProducts = {};
  setTimeout(() => fetchProducts(), 30 * 10000);
};

const fetchProducts = async function () {
  const { products } = await api.getBazaar();

  for (const item of Object.keys(products)) {
    const product = products[item].quick_status;

    bazaarProducts[item] = {
      id: item.toUpperCase(),
      name: helper.capitalize(item),
      buyPrice: product.buyPrice,
      buyVolume: product.buyVolume,
      buyOrders: product.buyOrders,
      sellPrice: product.sellPrice,
      sellVolume: product.sellVolume,
      sellOrders: product.sellOrders
    };
  }

  return await updateProducts();
};

if (process.env.NODE_APP_INSTANCE === '0') fetchProducts();
