const petGenerator = require('./petGenerator');
const constants = require('../src/constants');
const nbt = require('prismarine-nbt');
const helper = require('../src/helper');
const utils = require('util');
const parseNbt = utils.promisify(nbt.parse);

const getBackpackContents = async function (arraybuf) {
  const buf = Buffer.from(arraybuf);
  const data = nbt.simplify(await parseNbt(buf));

  const items = data.i;

  for (const [index, item] of items.entries()) {
    item.isInactive = true;
    item.inBackpack = true;
    item.item_index = index;
  }

  return items;
};

const parseItems = async function (base64, db) {
  const buf = Buffer.from(base64, 'base64');
  const data = nbt.simplify(await parseNbt(buf));

  const items = data.i;

  for (const [index, item] of items.entries()) {
    if (item.tag?.display?.Name.includes('Backpack')) {
      let backpackData;

      for (const key of Object.keys(item.tag.ExtraAttributes)) {
        if (key.endsWith('_data')) backpackData = item.tag.ExtraAttributes[key];
      }

      if (!Array.isArray(backpackData)) {
        continue;
      }

      const backpackContents = await getBackpackContents(backpackData);

      items.push(...backpackContents);
    }
  }

  for (const item of items) {
    if (item.tag?.ExtraAttributes?.id != undefined) {
      let itemName = helper.getRawLore(item.tag.display.Name);
      let itemId = item.tag.ExtraAttributes.id.toLowerCase();

      if (item.tag.ExtraAttributes.dungeon_item_level > 0) {
        const dungeonItemLevel = item.tag.ExtraAttributes.dungeon_item_level;

        if (dungeonItemLevel > 5) {
          const newStars = '⍟'.repeat(dungeonItemLevel - 5) + '✪'.repeat(5 - (dungeonItemLevel - 5));

          itemName = itemName.replace(/✪/g, '') + newStars;
        }
      }

      const ExtraAttributes = item.tag.ExtraAttributes;
      let price = db[itemId] * item.Count;

      if (ExtraAttributes.winning_bid && !itemId.includes('hegemony')) {
        price = ExtraAttributes.winning_bid;
      }

      if (itemId == 'enchanted_book' && ExtraAttributes.enchantments) {
        const enchants = Object.keys(ExtraAttributes.enchantments);

        if (enchants.length == 1) {
          const value = ExtraAttributes.enchantments[enchants[0]];

          price = db[`${enchants[0]}_${value}`] ?? 0;
          itemName = helper.capitalize(`${enchants[0]} ${value}`);
        }
      }

      if (ExtraAttributes.enchantments && itemId != 'enchanted_book') {
        for (const enchant of Object.entries(ExtraAttributes.enchantments)) {
          if (constants.blocked_enchants[itemId]?.includes(enchant[0])) continue;

          if (constants.allowed_enchants.includes(enchant[0])) {
            price += db[`${enchant[0]}_${enchant[1]}`] ?? 0;
          }
        }
      }

      if (ExtraAttributes.rarity_upgrades > 0 && ExtraAttributes.originTag) {
        if (ExtraAttributes.enchantments || constants.talismans[itemId]) {
          price += db['recombobulator_3000'] / 2;
        }
      }

      if (ExtraAttributes.gems) {
        const gems = helper.parseItemGems(ExtraAttributes.gems);

        for (const gem of Object.values(gems)) {
          price += db[`${gem.tier}_${gem.type}_gem`.toLowerCase()] ?? 0;
        }
      }

      if (ExtraAttributes.modifier && !constants.talismans[itemId]) {
        const reforge = ExtraAttributes.modifier;

        if (constants.reforges[reforge]) {
          price += db[constants.reforges[reforge]] ?? 0;
        }
      }

      if (ExtraAttributes.dungeon_item_level > 5) {
        const starsUsed = ExtraAttributes.dungeon_item_level - 5;

        for (const star of Array(starsUsed).keys()) {
          price += db[constants.master_stars[star]] ?? 0;
        }
      }

      if (ExtraAttributes.ability_scroll) {
        for (const item of Object.values(ExtraAttributes.ability_scroll)) {
          price += db[item.toLowerCase()] ?? 0;
        }
      }

      if (ExtraAttributes.gemstone_slots) {
        price += ExtraAttributes.gemstone_slots * db['gemstone_chamber'];
      }

      if (ExtraAttributes.drill_part_upgrade_module) {
        price += db[ExtraAttributes.drill_part_upgrade_module] ?? 0;
      }

      if (ExtraAttributes.drill_part_fuel_tank) {
        price += db[ExtraAttributes.drill_part_fuel_tank] ?? 0;
      }

      if (ExtraAttributes.drill_part_engine) {
        price += db[ExtraAttributes.drill_part_engine] ?? 0;
      }

      if (ExtraAttributes.ethermerge > 0) {
        price += db['etherwarp_conduit'] ?? 0;
      }

      item.price = price ?? 0;
      item.modified = { id: itemId, name: itemName };
    }
  }

  return items;
};

const getItems = async function (profile, db) {
  const output = {};

  if (profile.backpack_contents) {
    const storage = [];

    for (const backpack of Object.values(profile.backpack_contents)) {
      const items = await parseItems(backpack.data, db);

      storage.push(items);
    }

    output.storage = storage.flat();
  }

  if (profile.sacks_counts) {
    let sacksValue = 0;

    for (const [index, count] of Object.entries(profile.sacks_counts)) {
      const sackPrice = db[index.toLowerCase()];

      if (sackPrice != undefined) {
        sacksValue += sackPrice * count ?? 0;
      }
    }

    output.sacks = sacksValue;
  }

  output.inventory = profile.inv_contents ? await parseItems(profile.inv_contents.data, db) : [];
  output.enderchest = profile.ender_chest_contents ? await parseItems(profile.ender_chest_contents.data, db) : [];
  output.armor = profile.inv_armor ? await parseItems(profile.inv_armor.data, db) : [];
  output.wardrobe_inventory = profile.wardrobe_contents ? await parseItems(profile.wardrobe_contents.data, db) : [];

  if (profile.pets) {
    const pets = [];

    for (const pet of profile.pets) {
      const petData = petGenerator.getPetPrice(pet, db);

      pets.push(petData);
    }

    output.pets = pets;
  }

  output.talismans = profile.talisman_bag ? await parseItems(profile.talisman_bag.data, db) : [];

  if (output.inventory.length == 0) {
    output.no_inventory = true;
  }

  return output;
};

module.exports = { getItems };
