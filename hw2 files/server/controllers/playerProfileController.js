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
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, rows, fields) {
            if (err) {
                reject(new Error(err));
            } else {
                console.log("this should print first", rows);
                resolve(rows[0]);
            }
        });
    })
}

async function getRadarStats(playerId, position) {
    // List 6 stats for each positional radar
    const defensiveStats = ['pct_of_dribblers_tackled', 'succ_pressure_pct',
        'interceptions', 'aerials_won_pct', 'prog_passes',
        'long_pass_comp_pct'];

    const midfielderStats = ['pct_of_dribblers_tackled', 'succ_pressure_pct',
        'interceptions', 'succ_dribbles', 'prog_passes', 'xA'];

    const forwardStats = ['xA', 'succ_dribbles', 'prog_receptions', 'npxG',
        'npxG_per_Shot', 'Sh_per_90'];

    const goalkeeperStats = ['penalty_save_percentage', 'PSxG_difference',
        'AvgDist', 'stop_percentage',
        'long_pass_completion_pct', 'defensive_actions'];

    // // Assume queried player is an outfielder
    // var query = getPercentileForSelectedStatAndYear_Outfield;
    // // Array to store query results
    // var output = [];

    // if player's primary position is midfielder, assign him midfieldersRadarStats... do this for all positions
    if (position == 'DF') {
        positionRadarStats = defensiveRadarStats;
    } else if (position == 'MF') {
        positionRadarStats = midfieldersRadarStats;
    } else if (position == 'FW') {
        positionRadarStats = forwardRadarStats;
    } else {
        return Promise.all(goalkeeperRadarStats.map((inputStat) => {
            return makeQueryGK(playerId, inputStat);
        }))
    }

    return Promise.all(positionRadarStats.map((inputStat) => {
        return makeQueryOF(playerId, inputStat);
    }));
}

function makeQueryGK(playerId, inputStat) {
    const query = `
    WITH ranked AS(
    	SELECT player_id, ROW_NUMBER() OVER(ORDER BY ${inputStat}/90s_played) ROWNUMBER
        FROM player_gk_playing_time_stats
    		NATURAL JOIN player_gk_basic_stats
    		NATURAL JOIN player_gk_advanced_stats
        WHERE 90s_played > 2 AND season = 2021
    ), number_of_player_stats AS(
    	SELECT COUNT(*) AS total
    	FROM ranked r
    ), selected_players_ranking AS(
    	SELECT ROWNUMBER
    	FROM ranked r
    	WHERE player_id = ${playerId}
    	ORDER BY ROWNUMBER ASC
    	LIMIT 1
    )
    SELECT spr.ROWNUMBER / nops.total AS ${inputStat}_Percentile
    FROM number_of_player_stats nops, selected_players_ranking spr
    `;
    return new Promise((resolve, reject) => {
        connection.query(query, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows[0]);
            }
        })
    })
}

function makeQueryOF(playerId, inputStat) {
    const query = `
    WITH selected_player_position AS(
	     SELECT pp.primary_position, pp.secondary_position
	     FROM player_position pp
	     WHERE pp.player_id = ${playerId} AND pp.season = 2021
	     LIMIT 1
    ), same_position_players AS(
       SELECT pp.player_id
       FROM player_position pp
       WHERE pp.season = 2021 AND
		       ((pp.primary_position, pp.secondary_position) IN (SELECT * FROM selected_player_position) OR
		        (pp.secondary_position, pp.primary_position) IN (SELECT * FROM selected_player_position))
    ), ranked AS(
	     SELECT player_id, ROW_NUMBER() OVER(ORDER BY ${inputStat}/90s_played) ROWNUMBER
       FROM player_playing_time_stats
       NATURAL JOIN player_shooting_stats
		   NATURAL JOIN player_passing_stats
		   NATURAL JOIN player_possession_stats
		   NATURAL JOIN player_goal_shot_creation_stats
	     NATURAL JOIN player_pass_type_stats
   	 	 NATURAL JOIN player_misc_stats
	   	 NATURAL JOIN player_defensive_actions_stats
	   	 NATURAL JOIN same_position_players
       WHERE 90s_played > 2 AND season = 2021
    ), number_of_player_stats AS(
	     SELECT COUNT(*) AS total
	     FROM ranked r
    ), selected_players_ranking AS(
	     SELECT ROWNUMBER
	     FROM ranked r
	     WHERE player_id = ${playerId}
	     ORDER BY ROWNUMBER ASC
	     LIMIT 1
    )
    SELECT spr.ROWNUMBER / nops.total AS ${inputStat}_Percentile
    FROM number_of_player_stats nops, selected_players_ranking spr
    `;
    return new Promise((resolve, reject) => {
        connection.query(query, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows[0]);
            }
        })
    })
}

async function getStats(playerId, position) {
    // List 6 stats for each positional radar
    const defensiveStats = ['pct_of_dribblers_tackled/90s_played', 'succ_pressure_pct/90s_played',
        'interceptions/90s_played', 'aerials_won_pct/90s_played', 'prog_passes/90s_played',
        'long_pass_comp_pct/90s_played'];

    const midfielderStats = ['pct_of_dribblers_tackled/90s_played', 'succ_pressure_pct/90s_played',
        'interceptions/90s_played', 'succ_dribbles/90s_played',
        'prog_passes/90s_played', 'xA/90s_played'];

    const forwardStats = ['xA/90s_played', 'succ_dribbles/90s_played',
        'prog_receptions/90s_played', 'npxG/90s_played',
        'npxG_per_Shot/90s_played', 'Sh_per_90/90s_played'];

    const goalkeeperStats = ['penalty_save_percentage/90s_played', 'PSxG_difference/90s_played',
        'AvgDist/90s_played', 'stop_percentage/90s_played',
        'long_pass_completion_pct/90s_played', 'defensive_actions/90s_played'];

    const getStat_Outfield = `
    SELECT ppts.season, ppts.team, ppts.league, ${positionStats}
    FROM player_playing_time_stats ppts
        NATURAL JOIN player_shooting_stats
        NATURAL JOIN player_passing_stats
        NATURAL JOIN player_possession_stats
        NATURAL JOIN player_goal_shot_creation_stats
        NATURAL JOIN player_pass_type_stats
        NATURAL JOIN player_misc_stats
        NATURAL JOIN player_defensive_actions_stats
    WHERE player_id = ${playerId};
    `;

    const getStat_GK = `
    SELECT ppts.season, ppts.team, ppts.league, ${positionStats}
    FROM player_gk_playing_time_stats ppts
        NATURAL JOIN player_gk_basic_stats
        NATURAL JOIN player_gk_advanced_stats
    WHERE player_id = ${playerId};
    `;

    // Assume queried player is an outfielder
    var query = getStat_Outfield;

    // if player's primary position is midfielder, assign him midfieldersRadarStats... do this for all positions
    if (position == 'DF') {
        positionStats = defensiveStats;
    } else if (position == 'MF') {
        positionStats = midfielderStats;
    } else if (position == 'FW') {
        positionStats = forwardStats;
    } else {
        positionStats = goalkeeperStats;
        query = getStat_GK;
    }

    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.log(position, inputStat, idx);
            throw new Error(err.message);
        } else {
            return rows;
        }
    });
}

module.exports = { getPlayerInfo, getRadarStats, }
