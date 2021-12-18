const petGenerator = require('../generators/petGenerator');
const api = require('../storage/requestHandler');
const helper = require('../src/helper');
const db = require('../storage/database');

let auctions = {};

const fetchAuctions = async function (pages = 0) {
  for (let i = 0; i <= pages; i++) {
    const auctionPage = await api.getAuctionPage(i);
    if (!auctionPage.success) continue;

    pages = auctionPage.totalPages - 1;
    await processAuctions(auctionPage);
  }

  return await updateAuctions();
};

const updateAuctions = async function () {
  Object.keys(auctions).forEach(async item => {
    const sales = auctions[item].map(i => ({ price: i.price, count: i.count }));

    if (sales.length) {
      const lbin = Math.min(...sales.map(i => i.price));
      const auction = auctions[item].filter(i => i.price === lbin)[0];

      await db.auctions.updateOne({ id: item.toUpperCase() }, { sales: sales, auction: auction }, { upsert: true });
    }
  });

  auctions = {};
  setTimeout(() => fetchAuctions(), 30 * 10000);
};

const processAuctions = async function (data) {
  data.auctions
    .filter(a => a.bin)
    .forEach(async auction => {
      const item = await helper.decodeNBT(auction.item_bytes);

      const ExtraAttributes = item.tag.value.ExtraAttributes.value;
      const { id, name } = getAttributes(ExtraAttributes, auction.item_name);

      const format = {
        id: id.toUpperCase(),
        name: helper.capitalize(name),
        price: auction.starting_bid,
        seller: auction.auctioneer,
        ending: auction.end,
        count: item.Count.value
      };

      Object.keys(auctions).includes(id) ? auctions[id].push(format) : (auctions[id] = [format]);
    });
};

const getAttributes = function (item, itemName) {
  let itemId = item.id.value;

  if (itemId == 'ENCHANTED_BOOK' && item.enchantments) {
    const enchants = Object.keys(item.enchantments.value);

    if (enchants.length == 1) {
      const value = item.enchantments.value[enchants[0]].value;

      itemId = `${enchants[0]}_${value}`;
      itemName = helper.capitalize(`${enchants[0]} ${value}`);
    }
  }

  if (itemId == 'PET') {
    const pet = JSON.parse(item.petInfo.value);
    const data = petGenerator.calculateSkillLevel(pet);

    if (data.level == 1 || data.level == 100 || data.level == 200) {
      itemId = `lvl_${data.level}_${pet.tier}_${pet.type}`;
      itemName = `[Lvl ${data.level}] ${helper.capitalize(`${pet.tier} ${pet.type}`)}`;
    }
  }

  return {
    id: itemId,
    name: itemName
  };
};

if (process.env.NODE_APP_INSTANCE === '0') fetchAuctions();
