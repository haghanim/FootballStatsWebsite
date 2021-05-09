const config = require('../db-config');
const mysql = require('mysql');
config.connectionLimit = 10;
const connection = mysql.createPool(config);

async function getAllPlayers() {
    var query = `
    SELECT *
    FROM getAllPlayers`;

    return new Promise((resolve, reject) => {
        connection.query(query, function (err, rows, fields) {
            if (err) {
                // console.log(err);
                reject(new Error(err));
            } else {
                resolve(rows);
            }
        });
    })
}

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
                resolve(rows[0]);
            }
        });
    })
}

async function getRadarStats(playerId, position, secondary_position) {
    // List 6 stats for each positional radar
    const defenderStats = ['tackles', 'succ_pressures',
        'interceptions', 'aerials_won', 'prog_passes',
        'long_passes_comp'];

    const midfieldersRadarStats = ['tackles', 'succ_pressures',
        'interceptions', 'succ_dribbles', 'prog_passes', 'xA'];

    const forwardStats = ['xA', 'succ_dribbles', 'prog_receptions', 'npxG',
        'comp_passes_into_18_yd_box', 'Shots'];

    const goalkeeperStats = ['penalties_allowed', 'PSxG_difference',
        'SoTA', 'stop_percentage', 'long_passes_comp', 'defensive_actions'];

    const defensiveMidfielderStats = ['players_tackled_plus_interceptions', 'succ_pressures',
        'comp_passes_leading_to_final_third', 'tot_dist_traveled_by_comp_passes', 'aerials_won', 'loose_balls_recovered'];

    const wingerStats = ['succ_dribbles', 'xA',
        'npxG', 'prog_receptions', 'fouls_drawn', 'comp_passes_into_18_yd_box'];

    // if player's position is midfielder, assign him midfieldersRadarStats... do this for all positions
    if ((position == 'DF' && secondary_position == 'FW') ||
        (position == 'FW' && secondary_position == 'DF') ||
        (position == 'DF' && secondary_position == '')) {
        positionRadarStats = defenderStats;
    } else if (position == 'MF' && secondary_position == '') {
        positionRadarStats = midfieldersRadarStats;
    } else if (position == 'FW' && secondary_position == '') {
        positionRadarStats = forwardStats;
    } else if ((position == 'DF' && secondary_position == 'MF') ||
        (position == 'MF' && secondary_position == 'DF')) {
        positionRadarStats = defensiveMidfielderStats;
    } else if ((position == 'FW' && secondary_position == 'MF') ||
        (position == 'MF' && secondary_position == 'FW')) {
        positionRadarStats = wingerStats;
    } else { //else is a GK
        return Promise.all(goalkeeperStats.map((inputStat) => {
            return makeQueryGetPercentileForSelectedStatAndYear_GK(playerId, inputStat);
        }))
    }

    return Promise.all(positionRadarStats.map((inputStat) => {
        return makeQueryGetPercentileForSelectedStatAndYear_Outfield(playerId, inputStat);
    }));
}

function makeQueryGetPercentileForSelectedStatAndYear_GK(playerId, inputStat) {
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
    SELECT ROUND(spr.ROWNUMBER / nops.total*100, 2) AS ${inputStat}
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

function makeQueryGetPercentileForSelectedStatAndYear_Outfield(playerId, inputStat) {
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
    SELECT ROUND(spr.ROWNUMBER / nops.total*100, 2) AS ${inputStat}
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

async function getStats(playerId, position, secondary_position) {
    const defenderStats = ['pct_of_dribblers_tackled/90s_played', 'succ_pressure_pct/90s_played',
        'interceptions/90s_played', 'aerials_won_pct/90s_played', 'prog_passes/90s_played',
        'long_pass_comp_pct/90s_played'];

    const midfielderStats = ['pct_of_dribblers_tackled/90s_played', 'succ_pressure_pct/90s_played',
        'interceptions/90s_played', 'succ_dribbles/90s_played', 'prog_passes/90s_played', 'xA/90s_played'];

    const forwardStats = ['xA/90s_played', 'succ_dribbles/90s_played', 'prog_receptions/90s_played', 'npxG/90s_played',
        'npxG_per_Shot/90s_played', 'Shots/90s_played'];

    const goalkeeperStats = ['penalty_save_percentage/90s_played', 'PSxG_difference/90s_played',
        'AvgDist/90s_played', 'stop_percentage/90s_played', 'long_pass_completion_pct/90s_played', 'defensive_actions/90s_played'];

    const defensiveMidfielderStats = ['players_tackled_plus_interceptions/90s_played', 'succ_pressure_pct/90s_played',
        'comp_passes_leading_to_final_third/90s_played', 'tot_dist_traveled_by_comp_passes/90s_played', 'aerials_won/90s_played', 'loose_balls_recovered/90s_played'];

    const wingerStats = ['succ_dribbles/90s_played', 'xA/90s_played',
        'npxG/90s_played', 'prog_receptions/90s_played', 'fouls_drawn/90s_played', 'comp_passes_into_18_yd_box/90s_played'];

    // if player's position is midfielder, assign him midfieldersRadarStats... do this for all positions
    if ((position == 'DF' && secondary_position == 'FW') ||
        (position == 'FW' && secondary_position == 'DF') ||
        (position == 'DF' && secondary_position == '')) {
        positionStats = defenderStats;
    } else if (position == 'MF' && secondary_position == '') {
        positionStats = midfielderStats;
    } else if (position == 'FW' && secondary_position == '') {
        positionStats = forwardStats;
    } else if ((position == 'DF' && secondary_position == 'MF') ||
        (position == 'MF' && secondary_position == 'DF')) {
        positionStats = defensiveMidfielderStats;
    } else if ((position == 'FW' && secondary_position == 'MF') ||
        (position == 'MF' && secondary_position == 'FW')) {
        positionStats = wingerStats;
    } else { //else is a GK
        return Promise.all(goalkeeperStats.map((inputStat) => {
            return makeQueryGetStat_GK(playerId, inputStat);
        }));
    }

    return Promise.all(positionStats.map((inputStat) => {
        return makeQueryGetStat_Outfield(playerId, inputStat);
    }));
}

function makeQueryGetStat_Outfield(playerId, inputStat) {
    const query = `
    SELECT ppts.season, ppts.team, ppts.league, ${inputStat}
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
    return new Promise((resolve, reject) => {
        connection.query(query, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        })
    })
}

function makeQueryGetStat_GK(playerId, inputStat) {
    const query = `
    SELECT ppts.season, ppts.team, ppts.league, ${inputStat}
    FROM player_gk_playing_time_stats ppts
        NATURAL JOIN player_gk_basic_stats
        NATURAL JOIN player_gk_advanced_stats
    WHERE player_id = ${playerId};
    `;
    return new Promise((resolve, reject) => {
        connection.query(query, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        })
    })
}

module.exports = { getPlayerInfo, getRadarStats, getStats, getAllPlayers, }
