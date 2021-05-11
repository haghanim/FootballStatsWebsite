// Fix this Path so that it's local to your computer
const config = require('../db-config');
const mysql = require('mysql');

const PlayerProfileController = require('../controllers/playerProfileController')

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

// route handler that runs queries once a given player is selected
const getPlayerProfile = (req, res) => {
    playerId = req.params.playerId;

    //sequentially run all these queries then return all of their results
    return PlayerProfileController.getPlayerInfo(playerId)
        .then((playerInfo) => {
            // from the query just run get the selected player's primary position
            const position = playerInfo.Position;

            // from the query just run get the selected player's secondary position
            const secondary_position = playerInfo.secondary_position;

            return PlayerProfileController.getRadarStats(playerId, position, secondary_position)
                .then((radarStats) => {
                    return PlayerProfileController.getStats(playerId, position, secondary_position)
                        .then((playerStats) => {

                            // format results from the getStats query
                            // specifically this essentially performs a 'join'
                            // over the 6 tables returned, this way, displaying
                            // the data on the front end is much easier to do
                            var results = playerStats[0];
                            for (var i = 1; i < 6; i++) {
                                for (var j = 0; j < results.length; j++) {

                                    results[j][Object.keys(playerStats[i][j])[3]] = Object.values(playerStats[i][j])[3];
                                }
                            }

                            // finally, return results from the queries run above
                            res.status(200).json({ playerInfo, radarStats, playerStats: results });
                        })
                })
        }).catch((err) => {
            console.log(err.message);
            res.status(400).send(err);
        })
}

// route handler that runs query to get all players, where user can then view 
// basic info and select a given player
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
