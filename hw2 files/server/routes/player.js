// Fix this Path so that it's local to your computer
const config = require('C:/Users/alanf/OneDrive/Desktop/CIS450/Project/550FinalProject/hw2 files/server/db-config.js');
const mysql = require('mysql');

const PlayerProfileController = require('../controllers/playerProfileController')

config.connectionLimit = 10;
const connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

const getPlayerProfile = (req, res) => {
    playerId = req.params.playerId;
    const playerInfo = PlayerProfileController.getPlayerInfo(playerId);
    const radarStats = PlayerProfileController.getRadarStats(playerId, playerInfo.Position);

    res.status(200).json({playerInfo: playerInfo, radarStats: radarStats});

}

const getRadarStats = (req, res) => {
    // List 6 stats for each positional radar
    defensiveRadarStats = {
        'player_defensive_actions_stats': ['pct_of_dribblers_tackled', 'succ_pressure_pct', 'interceptions'],
        'player_misc_stats': ['aerials_won_pct'],
        'player_passing_stats': ['prog_passes', 'long_pass_comp_pct']
    }
    midfieldersRadarStats = {
        'player_defensive_actions_stats': ['pct_of_dribblers_tackled', 'succ_pressure_pct', 'interceptions'],
        'player_possession_stats': ['succ_dribbles'],
        'player_passing_stats': ['prog_passes', 'xA']
    }
    forwardRadarStats = {
        'player_passing_stats': ['xA'],
        'player_possession_stats': ['succ_dribbles', 'prog_receptions'],
        'player_shooting_stats': ['npxG', 'npxG_per_Shot', 'Sh_per_90']
    }
    goalkeeperRadarStats = {
        'player_gk_basic_stats': ['penalty_save_percentage'],
        'player_gk_advanced_stats': ['PSxG_difference', 'AvgDist', 'stop_percentage', 'long_pass_completion_pct'],
        'player_misc_stats': ['loose_balls_recovered']
    }

    // Assign position stats based on player's primary position
    // if player's primary position is midfielder, assign him midfieldersRadarStats... do this for all positions
    player_id = req.params.player_id;
    player_pos = 'MF';

    if (player_pos == 'DF') {
        positionRadarStats = defensiveRadarStats;
    } else if (player_pos == 'MF') {
        positionRadarStats = midfieldersRadarStats;
    } else if (player_pos == 'FW') {
        positionRadarStats = forwardRadarStats;
    } else {
        positionRadarStats = goalkeeperRadarStats;
    }

    // Get names of each of the three tables used
    firstTable = Object.keys(positionRadarStats)[0]
    secondTable = Object.keys(positionRadarStats)[1]
    thirdTable = Object.keys(positionRadarStats)[2]

    // Get string of attributes from each of the three tables used
    firstTableAttributes = positionRadarStats[firstTable]
    secondTableAttributes = positionRadarStats[secondTable]
    thirdTableAttributes = positionRadarStats[thirdTable]

    // Replace * with attributes
    var query = `
    (SELECT ${firstTableAttributes}
    FROM ${firstTable})
    UNION
    (SELECT ${secondTableAttributes}
    FROM ${secondTable})
    UNION
    (SELECT ${thirdTableAttributes}
    FROM ${thirdTable})
    UNION`;

    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.log(err);
            res.status(400).json({ 'message': 'generic error message' });
        } else {
            console.log(rows);
            res.status(200).json(rows);
        }
    });
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
    getPlayerName: getPlayerName,
    getPercentileForSelectedStatAndYear_GK: getPercentileForSelectedStatAndYear_GK,
    getPercentileForSelectedStatAndYear_Outfield: getPercentileForSelectedStatAndYear_Outfield,
    getRadarStats: getRadarStats
};
