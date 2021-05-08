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
            console.log(playerInfo);
            res.status(200).send();
        })
        //     return PlayerProfileController.getRadarStats(playerId, playerInfo.Position)
        //         .then((radarStats) => {
        //             // console.log(radarStats);

        //             res.status(200).send('done');
        //         })
        // })
        .catch((err) => {
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


const getPercentileForSelectedStatAndYear_Outfield = (req, res) => {
    var query = `
    WITH selected_player_position AS(
	     SELECT pp.primary_position, pp.secondary_position
	     FROM player_position pp
	     WHERE pp.player_id = ${input_player_id} AND pp.season = ${input_season}
	     LIMIT 1
    ), same_position_players AS(
       SELECT pp.player_id
       FROM player_position pp
       WHERE pp.season = ${input_season} AND
		       ((pp.primary_position, pp.secondary_position) IN (SELECT * FROM selected_player_position) OR
		        (pp.secondary_position, pp.primary_position) IN (SELECT * FROM selected_player_position))
    ), ranked AS(
	     SELECT player_id, season, team, league, ${input_stat}, ${input_stat}/90s_played, ROW_NUMBER() OVER(ORDER BY ${input_stat}/90s_played) ROWNUMBER
       FROM player_playing_time_stats
       NATURAL JOIN player_shooting_stats
		   NATURAL JOIN player_passing_stats
		   NATURAL JOIN player_possession_stats
		   NATURAL JOIN player_goal_shot_creation_stats
	     NATURAL JOIN player_pass_type_stats
   	 	 NATURAL JOIN player_misc_stats
	   	 NATURAL JOIN player_defensive_actions_stats
	   	 NATURAL JOIN same_position_players
       WHERE 90s_played > 2 AND season = ${input_season}
    ), number_of_player_stats AS(
	     SELECT COUNT(*) AS total
	     FROM ranked r
    ), selected_players_ranking AS(
	     SELECT ROWNUMBER
	     FROM ranked r
	     WHERE player_id = ${input_player_id} AND season = ${input_season}
	     ORDER BY ROWNUMBER ASC
	     LIMIT 1
    )
    SELECT spr.ROWNUMBER / nops.total AS ${input_stat}_Percentile
    FROM number_of_player_stats nops, selected_players_ranking spr
    `;
    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getPercentileForSelectedStatAndYear_GK = (req, res) => {
    var query = `
    WITH ranked AS(
    	SELECT player_id, season, team, league, ${input_stat}, ${input_stat}/90s_played, ROW_NUMBER() OVER(ORDER BY ${input_stat}/90s_played) ROWNUMBER
        FROM player_gk_playing_time_stats
    		NATURAL JOIN player_gk_basic_stats
    		NATURAL JOIN player_gk_advanced_stats
        WHERE 90s_played > 2 AND season = ${input_season}
    ), number_of_player_stats AS(
    	SELECT COUNT(*) AS total
    	FROM ranked r
    ), selected_players_ranking AS(
    	SELECT ROWNUMBER
    	FROM ranked r
    	WHERE player_id = ${input_playerID} AND season = ${input_season}
    	ORDER BY ROWNUMBER ASC
    	LIMIT 1
    )
    SELECT 1 - spr.ROWNUMBER / nops.total AS ${input_stat}_Percentile
    FROM number_of_player_stats nops, selected_players_ranking spr
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
    getPlayerProfile: getPlayerProfile,
};
