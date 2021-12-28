const URL = require('url').URL;
const axios = require('axios');
const config = require('../config');

const HYPIXEL_API = 'https://api.hypixel.net';
const PLAYER_ROUTE = HYPIXEL_API + '/player';
const AUCTIONS_ROUTE = HYPIXEL_API + '/skyblock/auctions';
const PROFILE_ROUTE = HYPIXEL_API + '/skyblock/profiles';
const BAZAAR_ROUTE = HYPIXEL_API + '/skyblock/bazaar';

let tokens = config.apiKeys;
let currentIndex = 0;

const rotateKey = function () {
  if (currentIndex + 1 === tokens.length) currentIndex = -1;
  currentIndex = currentIndex + 1;

  return tokens[currentIndex];
};

const getPlayer = async function (uuid) {
  const url = new URL(PLAYER_ROUTE);
  url.searchParams.append('key', rotateKey());
  url.searchParams.append('uuid', uuid);

  const response = await axios(url.toString());

  return response.data.player;
};

const getSkyblockProfile = async function (uuid) {
  const url = new URL(PROFILE_ROUTE);
  url.searchParams.append('key', rotateKey());
  url.searchParams.append('uuid', uuid);

  const response = await axios(url.toString());

  return response.data.profiles;
};

const getBazaar = async function () {
  const url = new URL(BAZAAR_ROUTE);

  const response = await axios(url.toString());

  return response.data;
};

const getAuctionPage = async function (page = 0) {
  const url = new URL(AUCTIONS_ROUTE);
  url.searchParams.append('page', page);

  const response = await axios(url.toString());

  return response.data;
};

module.exports = { getPlayer, getSkyblockProfile, getBazaar, getAuctionPage };
