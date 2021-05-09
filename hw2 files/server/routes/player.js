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
                            var results = playerStats[0];
                            for (var i = 1; i < 6; i++) {
                                for (var j = 0; j < results.length; j++) {

                                    results[j][Object.keys(playerStats[i][j])[3]] = Object.values(playerStats[i][j])[3];
                                }
                            }
                            res.status(200).json({ playerInfo, radarStats, playerStats: results });
                        })
                })
        }).catch((err) => {
            console.log(err.message);
            res.status(400).send(err);
        })
}


const getAllPlayers = (req, res) => {


    return PlayerProfileController.getAllPlayers()
        .then((playersList) => {
            res.status(200).json(playersList);
        })
        .catch((err) => {
            res.status(400).json(err);
        })
}

// Keep this
module.exports = {
    getAllPlayers: getAllPlayers,
    getPlayerProfile: getPlayerProfile,
};
