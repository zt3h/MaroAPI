const constants = require('./constants');
const nbt = require('prismarine-nbt');
const parseNbt = require('util').promisify(nbt.parse);

const slots = {
  normal: Object.keys(constants.gemstones),
  special: ['UNIVERSAL', 'COMBAT', 'OFFENSIVE', 'DEFENSIVE', 'MINING'],
  ignore: ['unlocked_slots']
};

const getKey = function (key) {
  const intKey = new Number(key);

  if (!isNaN(intKey)) {
    return intKey;
  }

  return key;
};

const decodeNBT = async function (data) {
  const buffer = Buffer.from(data, 'base64');
  const item = await parseNbt(buffer);

  if (item === undefined) {
    return null;
  }

  return item.value.i.value.value[0];
};

const getPath = function (obj, ...keys) {
  if (obj == null) {
    return undefined;
  }

  let loc = obj;

  for (let i = 0; i < keys.length; i++) {
    loc = loc[getKey(keys[i])];

    if (loc === undefined) {
      return undefined;
    }
  }

  return loc;
};

const getRawLore = function (text) {
  const parts = text.split('§');
  let output = '';

  for (const [index, part] of parts.entries()) {
    output += part.substring(Math.min(index, 1));
  }

  return output;
};

const removeReforge = function (text) {
  const items = constants.forge_items;

  if (!items.includes(text)) {
    text = text.split(' ').slice(1).join(' ');
  }

  return text;
};

const capitalize = function (str) {
  const words = str.replace(/_/g, ' ').toLowerCase().split(' ');

  const upperCased = words.map(word => {
    return word.charAt(0).toUpperCase() + word.substr(1);
  });

  return upperCased.join(' ');
};

const parseItemGems = function (gems) {
  const parsed = [];

  for (const [key, value] of Object.entries(gems)) {
    if (slots.ignore.includes(key)) continue;

    const slot_type = key.split('_')[0];

    if (slots.special.includes(slot_type)) {
      parsed.push({ type: gems[`${key}_gem`], tier: value });
    } else if (slots.normal.includes(slot_type)) {
      parsed.push({ type: key.split('_')[0], tier: value });
    }
  }

  return parsed;
};

const getAverage = function (arr) {
  const average = arr.reduce((a, b) => a + b, 0) / arr.length;

  if (!average) {
    return 0;
  }

  return average;
};

const getMedian = function (values) {
  if (!values.length) return 0;

  values.sort((a, b) => a - b);

  const half = Math.floor(values.length / 2);

  if (values.length % 2) {
    return values[half];
  }

  return (values[half - 1] + values[half]) / 2.0;
};

const getMean = function (numbers) {
  let total = 0;

  for (let i = 0; i < numbers.length; i += 1) {
    total += numbers[i];
  }

  return total / numbers.length;
};

const getMode = function (numbers) {
  numbers.sort((x, y) => x - y);

  let bestStreak = 1;
  let bestElem = numbers[0];
  let currentStreak = 1;
  let currentElem = numbers[0];

  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i - 1] !== numbers[i]) {
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
        bestElem = currentElem;
      }

      currentStreak = 0;
      currentElem = numbers[i];
    }

    currentStreak++;
  }

  return currentStreak > bestStreak ? currentElem : bestElem;
};

module.exports = { getPath, decodeNBT, getRawLore, capitalize, parseItemGems, removeReforge, getAverage, getMedian, getMean, getMode };
