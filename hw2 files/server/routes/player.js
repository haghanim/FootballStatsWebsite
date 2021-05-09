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
    return PlayerProfileController.getPlayerInfo(playerId)
        .then((playerInfo) => {
            const position = playerInfo.Position;
            const secondary_position = playerInfo.secondary_position;
            return PlayerProfileController.getRadarStats(playerId, position, secondary_position)
                .then((radarStats) => {
                    return PlayerProfileController.getStats(playerId, position, secondary_position)
                        .then((playerStats) => {
                            res.status(200).json({ playerInfo, radarStats, playerStats });
                        })
                })
        }).catch((err) => {
            console.log(err.message);
            res.status(400).send('error');
        })
}


const getAllPlayers = (req, res) => {
    var query = `
    SELECT *
    FROM getAllPlayers`;

    connection.query(query, function (err, rows, fields) {
        if (err) {
            // console.log(err);
            res.status(400).json({ 'message': 'generic error message' });
        } else {
            res.status(200).json(rows);
        }
    });
}

// Keep this
module.exports = {
    getAllPlayers: getAllPlayers,
    getPlayerProfile: getPlayerProfile,
};
