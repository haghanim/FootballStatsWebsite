// Fix this Path so that it's local to your computer
const TeamController = require("../controllers/teamController");
const config = require('../db-config');
const mysql = require('mysql');

config.connectionLimit = 10;
const connection = mysql.createPool(config);


/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

const getAllTeams = (req, res) => {
    return TeamController.getAllTeams()
        .then((teamList) => {
            res.status(200).json(teamList);
        })
        .catch((err) => {
            res.status(400).json({ message: err });
        })
};

const getTeamLeagues = (req, res) => {

    teamId = req.params.team_id

    var query = `
    SELECT DISTINCT(league)
    FROM player_passing_stats pps
    JOIN (SELECT * FROM team t WHERE t.team_id = ${teamId}) AS t ON t.name = pps.team
  `;

    connection.query(query, function (err, rows, fields) {
        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    })
};

// query a - Player who contributed highest % of team’s xG, xA, and xG + xA in any given season over last few years (player_name, season, xg, percentage_xg).
// This is for all comps.

const getMostXgXaContributer = (req, res) => {
    input_teamID = req.input_team

    var query = `
    WITH teamHomeXG AS(
        SELECT season, home AS team, sum(xG_Home) AS team_xG
        FROM Fixtures f
        JOIN team t ON t.name = f.home
        WHERE t.team_id = ${input_teamID}
        GROUP BY season, home
    ),
    teamAwayXG AS(
        SELECT season, away AS team, sum(xG_Away) AS team_xG
        FROM Fixtures f
        JOIN team t ON t.name = f.away
        WHERE t.team_id = ${input_teamID}
        GROUP BY season, away
    ),
    teamHomeAwayXG AS (
        SELECT *
        FROM teamHomeXG
        UNION
        SELECT *
        FROM teamAwayXG
    ),
    teamTotalXG AS (
        SELECT season, team, SUM(team_xg) AS team_xg
        FROM teamHomeAwayXG
        GROUP BY season, team
    ),
    playerXA AS (
        SELECT player_id, season, team, SUM(xA) AS xA
        FROM player_passing_stats pps
        JOIN team t ON t.name = pps.team
        WHERE t.team_id = ${input_teamID}
        GROUP BY player_id, season, team
    ),
    playerXG AS (
        SELECT player_id, season, team, SUM(xG) AS xG
        FROM player_shooting_stats pss
        JOIN team t ON t.name = pss.team
        WHERE t.team_id = ${input_teamID}
        GROUP BY player_id, season, team
    ),
    playerXGXA AS (
        SELECT pxg.player_id, pxg.season, pxg.team, pxg.xG, pxa.xA
        FROM playerXG pxg
        NATURAL JOIN playerXA pxa
    )
    SELECT po.name, pxgxa.team, pxgxa.season,
    pxgxa.xG / ttxg.team_xg AS percentXgContribution,
    pxgxa.xA / ttxg.team_xg AS percentXaContribution,
    (pxgxa.xG + pxgxa.xA) / ttxg.team_xg AS percentXgXAContribution
    FROM playerXGXA pxgxa
    JOIN teamTotalXG ttxg ON pxgxa.season = ttxg.season
    NATURAL JOIN Player_Outfield po
    ORDER BY percentXgXAContribution DESC
    LIMIT 10
  `;

    connection.query(query, function (err, rows, fields) {
        console.log('helloGetteam_names')

        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });

};

const getMostProgressivePlayer = (req, res) => {
    var query = `
    WITH team_outfielders AS(
        SELECT ppts.player_id,
            SUM(ppts.90s_played) AS 90s_played,
            SUM(ppas.prog_passes) AS prog_passes,
            SUM(ppas.comp_passes_leading_to_final_third) AS comp_passes_f3,
            SUM(ppos.att_3rd_carries) AS f3_carries,
            SUM(ppos.prog_dist_carried) AS prog_dist_carried
    	  FROM player_playing_time_stats ppts
    	  NATURAL JOIN player_passing_stats ppas
    	  NATURAL JOIN player_possession_stats ppos
    	  JOIN team t ON t.name = ppts.team
    	  WHERE t.team_id = ${input_teamID} AND ppts.season = ${input_season}
    	  GROUP BY ppts.player_id
    ), team_outfielders_per_90 AS(
    	  SELECT player_id, prog_passes/90s_played AS prog_passes_p90, comp_passes_f3/90s_played AS comp_passes_f3_p90, f3_carries/90s_played AS f3_carries_p90, prog_dist_carried/90s_played AS prog_dist_carried_p90
    	  FROM team_outfielders
        WHERE 90s_played > 2
    ), ranked AS(
    	  SELECT player_id,
            ROW_NUMBER() OVER(ORDER BY prog_passes_p90) ROWNUMBER1,
            ROW_NUMBER() OVER(ORDER BY comp_passes_f3_p90) ROWNUMBER2,
            ROW_NUMBER() OVER(ORDER BY f3_carries_p90) ROWNUMBER3,
            ROW_NUMBER() OVER(ORDER BY prog_dist_carried_p90) ROWNUMBER4
    	  FROM team_outfielders_per_90
    ), number_of_players AS(
    	  SELECT COUNT(*) AS total
    	  FROM team_outfielders_per_90
    ), percentiles AS(
    	   SELECT r.player_id,
             r.ROWNUMBER1/n.total AS prog_passes_percentile,
             r.ROWNUMBER2/n.total AS comp_passes_f3_percentile,
             r.ROWNUMBER3/n.total AS f3_carries_percentile,
             r.ROWNUMBER4/n.total AS prog_dist_carried_percentile
    	   FROM ranked r, number_of_players n
    )
    SELECT name, (prog_passes_percentile+comp_passes_f3_percentile+f3_carries_percentile+prog_dist_carried_percentile)/4 AS ranking
    FROM percentiles
    NATURAL JOIN Player_Outfield
    ORDER BY ranking DESC
    LIMIT 5;
  `;
    connection.query(query, function (err, rows, fields) {
        console.log('hello')

        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getMostDominantAgainst = (req, res) => {
    var query = `
    WITH goals_diff AS(
    		(SELECT t2.team_id AS against_id, (goals_scored_by_home - goals_scored_by_away) AS goals_diff
    		FROM Fixtures
    		JOIN team t1 ON home = t1.name
    		JOIN team t2 ON away = t2.name
    		WHERE t1.team_id = ${input_teamID})
    		UNION ALL
    		(SELECT t1.team_id AS against_id, (goals_scored_by_away - goals_scored_by_home) AS goals_diff
    		FROM Fixtures
    		JOIN team t1 ON home = t1.name
    		JOIN team t2 ON away = t2.name
    		WHERE t2.team_id = ${input_teamID})
    ), temp AS(
    		SELECT goals_diff.against_id, AVG(goals_diff.goals_diff)
    		FROM goals_diff
    		GROUP BY goals_diff.against_id
    		ORDER BY AVG(goals_diff.goals_diff) DESC
    )
    SELECT team.name AS opponent, temp.avg_goal_diff AS avg_goal_advantage
    FROM temp
    JOIN team ON team_id = against_id
  `;
    connection.query(query, function (err, rows, fields) {
        console.log('hello')

        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getAvgAge = (req, res) => {
    var query = `
    WITH team_outfielders AS(
        SELECT ppts.player_id, ppts.league, ppts.minutes_played
    	  FROM team t
    		JOIN player_playing_time_stats ppts ON t.name = ppts.team
    		WHERE t.team_id = ${input_teamID} AND ppts.season = ${input_season}
    ), team_gks AS(
    	  SELECT pgpts.player_id, pgpts.league, pgpts.minutes_played
    	  FROM team t
    	  JOIN player_gk_playing_time_stats pgpts ON t.name = pgpts.team
      	WHERE t.team_id = ${input_teamID} AND pgpts.season = ${input_season}
    ), team_squad AS(
    	  (SELECT *
    		FROM team_outfielders)
    		UNION ALL
    		(SELECT *
    		FROM team_gks)
    ), total_minutes_played AS(
    	  SELECT SUM(minutes_played) AS tot
    		FROM team_squad
    ), mod_team_squad AS(
    	  SELECT player_id, league, t.minutes_played/tmp.tot AS weight
    		FROM team_squad t, total_minutes_played tmp
    ), with_birthyear AS(
    		(SELECT mts.player_id, mts.league, mts.weight * (2021 - po.year_born) AS weighted_age
    		FROM mod_team_squad mts
    		JOIN Player_Outfield po ON mts.player_id = po.player_id)
            UNION
            (SELECT mts.player_id, mts.league, mts.weight * (2021 - pgk.year_born) AS weighted_age
    		FROM mod_team_squad mts
    		JOIN Player_GK pgk ON mts.player_id = pgk.player_id)
    )
    SELECT SUM(weighted_age) AS weighted_team_age
    FROM with_birthyear;
  `;
    connection.query(query, function (err, rows, fields) {
        console.log('hello')

        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};

const getWinPcts = (req, res) => {
    var query = `
    WITH goals_diff_table AS(
    	SELECT t1.team_id AS home_id, t2.team_id AS away_id, (goals_scored_by_home - goals_scored_by_away) AS goals_diff
    	FROM Fixtures
    	JOIN team t1 ON home = t1.name
    	JOIN team t2 ON away = t2.name
    	WHERE t1.team_id = ${input_teamID} OR t2.team_id = ${input_teamID}
    ), home_wins AS(
    	SELECT COUNT(*) AS home_wins
    	FROM goals_diff_table
    	WHERE goals_diff > 0 AND home_id = ${input_teamID}
    ), home_games AS(
    	SELECT COUNT(*) AS num_home_games
    	FROM goals_diff_table
    	WHERE home_id = ${input_teamID}
    ), away_wins AS(
    	SELECT COUNT(*) AS away_wins
    	FROM goals_diff_table
        WHERE goals_diff < 0 AND away_id = ${input_teamID}
    ), away_games AS(
    	SELECT COUNT(*) AS num_away_games
    	FROM goals_diff_table
    	WHERE away_id = ${input_teamID}
    ), draws AS(
        SELECT COUNT(*) AS draws
        FROM goals_diff_table
        WHERE goals_diff = 0 AND (home_id = ${input_teamID} OR away_id = ${input_teamID} )
    )
    SELECT home_wins.home_wins / home_games.num_home_games AS home_win_pct,
            away_wins.away_wins / away_games.num_away_games AS away_win_pct,
            (home_wins.home_wins+away_wins.away_wins)/(home_games.num_home_games+away_games.num_away_games) AS total_win_pct,
            (draws)/(home_games.num_home_games+away_games.num_away_games) AS total_draw_pct
    FROM home_wins, home_games, away_wins, away_games, draws;
  `;
    connection.query(query, function (err, rows, fields) {
        console.log('hello')

        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};


// query g: xG and xG recent trendline and performance of last 10-30 matches. (Definitely) 
const get30RecentGames = (req, res) => {
    teamId = req.param.teamId

    var query = `
    WITH teamHomeXG AS(
        SELECT date, xG_Home AS team_xG, xG_Away AS team_xGA
        FROM Fixtures f
        JOIN team t ON t.name = f.home
        WHERE t.team_id = ${teamId} AND ((xG_Away + xG_Home) <> 0)
        ORDER BY date DESC
        LIMIT 30
    ),
    teamAwayXG AS(
        SELECT date, xG_Away AS team_xG, xG_Home AS team_xGA
        FROM Fixtures f
        JOIN team t ON t.name = f.away
        WHERE t.team_id = ${teamId} AND ((xG_Away + xG_Home) <> 0)
        ORDER BY date DESC
        LIMIT 30
    )
        (SELECT *
        FROM teamHomeXG
        UNION
        SELECT *
        FROM teamAwayXG)
        ORDER BY date DESC
  `;
    connection.query(query, function (err, rows, fields) {
        console.log('hello')

        if (err) console.log(err);
        else {
            console.log(rows);
            res.json(rows);
        }
    });
};


module.exports = {
    getTeamLeagues: getTeamLeagues,
    get30RecentGames: get30RecentGames,
    getAllTeams: getAllTeams,
    getMostXgXaContributer: getMostXgXaContributer,
    getWinPcts: getWinPcts,
    getMostDominantAgainst: getMostDominantAgainst,
    getAvgAge: getAvgAge,
    getMostProgressivePlayer: getMostProgressivePlayer,
};
