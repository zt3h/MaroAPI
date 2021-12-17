const axios = require('axios');

const getActiveProfile = function (profiles, uuid) {
  return profiles.sort((a, b) => b.members[uuid].last_save - a.members[uuid].last_save)[0];
};

const getNetworth = async function (uuid, key) {
  const { data } = await axios.get(`https://api.hypixel.net/skyblock/profiles?key=${key}&uuid=${uuid}`);

  const activeProfile = getActiveProfile(data.profiles, uuid);

  const profile = activeProfile.members[uuid];
  profile.banking = activeProfile.banking;

  const response = await axios.post('http://localhost:3000/api/networth/categories', { data: profile });

  console.log(response.data.data);

  return response.data;
};

getNetworth('1e8ce70dff344393a170c3f9d0f57d76', '');
