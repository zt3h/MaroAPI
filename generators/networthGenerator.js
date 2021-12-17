const isItemRecombobulated = function (item) {
  let recombobulated;

  if (item.tag?.ExtraAttributes?.rarity_upgrades != undefined) {
    recombobulated = true;
  }

  return recombobulated;
};

const getNetworth = async function (data, profile) {
  const output = { categories: {} };

  for (const key of Object.keys(data).filter(k => k != 'sacks')) {
    const category = { items: [], total: 0 };

    for (const item of data[key].filter(i => i.price)) {
      category.total += item.price;

      category.items.push({
        id: item.modified.id,
        name: item.modified.name,
        price: parseInt(item.price),
        recomb: isItemRecombobulated(item),
        heldItem: item.heldItem,
        count: item.Count?.value ?? 1
      });
    }

    if (category.items.length > 0) {
      output.categories[key] = {
        total: parseInt(category.total),
        top_items: category.items.sort((a, b) => b.price - a.price).filter(e => e)
      };
    }
  }

  output.bank = profile.banking?.balance ?? null;
  output.purse = profile.coin_purse ?? null;
  output.sacks = data.sacks ?? 0;

  output.networth = Object.values(output.categories).reduce((a, b) => a + b.total, 0) + output.sacks;

  return output;
};

module.exports = { getNetworth };
