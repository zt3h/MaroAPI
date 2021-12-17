const db = require('../storage/database');
const router = require('express').Router();

router.get('/networth', async (req, res) => {
  const output = { positions: [] };

  for (const player of await db.leaderboard.find()) {
    output.positions.push({
      uuid: player.uuid,
      name: player.name,
      total: player.networth.total,
      rank: player.networth.rank
    });
  }

  output.positions = output.positions.sort((a, b) => a.rank - b.rank);

  return res.status(200).json({
    status: 200,
    data: output
  });
});

module.exports = router;
