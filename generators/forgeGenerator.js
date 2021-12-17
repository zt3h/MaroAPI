const constants = require('../src/constants');
const helper = require('../src/helper');

const findProfits = function (db) {
  const forgeItems = constants.forge_recipes;
  const output = {};

  for (const key of Object.keys(forgeItems)) {
    const items = forgeItems[key];
    const recipe = [];

    for (const item of Object.entries(items)) {
      const data = db[item[0]];
      if (data === undefined) continue;

      let index = 0, count = 0;

      while (count < item[1]) {
        if (data.type == 'AUCTION') {
          if (!data.sales[index]) index = 0;

          count += data.sales[index].count;
          recipe.push(data.sales[index].price);
        }

        if (data.type == 'BAZAAR') {
          count += data.count ?? 1;
          recipe.push(data.price);
        }

        index++;
      }
    }

    const listedPrice = db[key]?.price;
    const craftPrice = recipe.reduce((a, b) => a + b, 0);

    if (craftPrice < listedPrice) {
      const difference = listedPrice - craftPrice;
      const nameWithoutReforge = helper.removeReforge(db[key].name);

      output[key] = {
        id: key.toUpperCase(),
        name: nameWithoutReforge,
        profit: difference,
        auction: listedPrice,
        crafting: craftPrice
      };
    }
  }

  const profits = Object.values(output).sort((a, b) => b.profit - a.profit, 0);

  return profits;
};

module.exports = { findProfits };
