const URL = require('url').URL;
const axios = require('axios');

const HYPIXEL_API = 'https://api.hypixel.net';
const AUCTIONS_ROUTE = HYPIXEL_API + '/skyblock/auctions';
const BAZAAR_ROUTE = HYPIXEL_API + '/skyblock/bazaar';

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

module.exports = { getBazaar, getAuctionPage };
