// Fix this Path so that it's local to your computer
const config = require('../db-config');
const mysql = require('mysql');

const PlayerProfileController = require('../controllers/playerProfileController')

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

const getPlayerProfile = (req, res) => {
    playerId = req.params.playerId;
    // const playerInfo = PlayerProfileController.getPlayerInfo(playerId);
    // const radarStats = PlayerProfileController.getRadarStats(playerId, playerInfo.Position);

    res.status(200).json({ playerInfo: playerInfo, radarStats: radarStats });
}

const getAllPlayers = (req, res) => {
    console.log('yo');
    var query = `
    SELECT *
    FROM getAllPlayers`;

    connection.query(query, function (err, rows, fields) {
        if (err) {
            // console.log(err);
            res.status(400).json({ 'message': 'generic error message' });
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });
}

const getPlayerName = (req, res) => {
    var query = `
    SELECT name
    FROM player
    LIMIT 20;
  `;
    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};


// Keep this
module.exports = {
    getAllPlayers: getAllPlayers,
    getPlayerName: getPlayerName,
    getPlayerProfile: getPlayerProfile,
};
