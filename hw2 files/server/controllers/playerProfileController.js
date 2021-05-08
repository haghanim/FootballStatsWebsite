const config = require('../db-config');
const mysql = require('mysql');
config.connectionLimit = 10;
const connection = mysql.createPool(config);

async function getPlayerInfo(playerId) {
    const query = `
    SELECT *
    FROM getAllPlayers
    WHERE player_id = ${playerId}
    `
    connection.query(query, function (err, rows, fields) {
        if (err) {
            res.status(400).json({ 'message': 'error in getPlayerInfo' });
        } else {
            return rows;
        }
    });
}

// async function getRadarStats(playerId, position) {
//     if (position == )
// }

module.exports = { getPlayerInfo, }